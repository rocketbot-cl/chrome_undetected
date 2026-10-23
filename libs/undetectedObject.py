import subprocess
import platform
import socket
import undetected_chromedriver_uc as uc
from webdriver_manager_uc.chrome import ChromeDriverManager
from selenium_uc.webdriver.common.by import By
from selenium_uc.webdriver.support.ui import WebDriverWait
from selenium_uc.webdriver.support import expected_conditions as EC
from selenium_uc.common.exceptions import TimeoutException
from undetected_chromedriver_uc.patcher import Patcher

BY_TYPES = {
    "id": By.ID,
    "class": By.CLASS_NAME,
    "xpath": By.XPATH,
    "css": By.CSS_SELECTOR,
    "link": By.LINK_TEXT,
    "partial_link": By.PARTIAL_LINK_TEXT,
    "name": By.NAME,
    "tag": By.TAG_NAME
}


class UndetectedBrowser:
    def __init__(self, folderPath=" ", port="5002"):
        self.driver = None
        self.profile_path = folderPath if folderPath else " "
        self.system = platform.system()
        self.browser_path = (
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
            if self.system == "Darwin"
            else 'start "" chrome'
        )
        self.port = str(port)

    def get_driver_class(self):
        if self.driver:
            return self.driver.__class__
        else:
            return None

    def launch_browser(self):
        command = f'{self.browser_path} --remote-debugging-port={self.port} --user-data-dir="{self.profile_path}"'
        subprocess.Popen(command, shell=True)

    def get_available_port(self):
        port = int(self.port)

        while port <= 65535:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
                try:
                    sock.bind(("127.0.0.1", port))
                    return str(port)
                except OSError:
                    port += 1

        raise RuntimeError("No free port available for undetected Chrome")

    def open(self):
        if self.system == "Darwin":
            # Rocketbot may already be using the configured port (5002
            # by default). Keep it when available and otherwise use the next free port.
            self.port = self.get_available_port()
        else:
            self.launch_browser()

        driver_exe_path = self.download_driver()
        if self.system == "Darwin":
            # UC modifica ChromeDriver para hacerlo undetected.
            patcher = Patcher(executable_path=driver_exe_path)
            patcher.auto()

            # La modificación invalida la firma original. Se vuelve a firmar antes de que Selenium intente iniciar el servicio.
            sign_result = subprocess.run(
                [
                    "/usr/bin/codesign",
                    "--force",
                    "--sign",
                    "-",
                    driver_exe_path
                ],
                capture_output=True,
                text=True
            )

            if sign_result.returncode != 0:
                raise RuntimeError(
                    "No se pudo firmar ChromeDriver en macOS: "
                    + sign_result.stderr.strip()
                )
        options = uc.ChromeOptions()
        options.add_argument("--no-sandbox")
        options.debugger_address = f"127.0.0.1:{self.port}"
        user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15'
        options.add_argument(f'user-agent={user_agent}')

        if self.system == "Darwin":
            self.driver = uc.Chrome(
                options=options,
                user_data_dir=self.profile_path,
                browser_executable_path=self.browser_path,
                driver_executable_path=driver_exe_path,
                use_subprocess=True
            )
        else:
            options.user_data_dir = self.profile_path
            self.driver = uc.Chrome(
                options=options,
                browser_executable_path=driver_exe_path,
                executable_path=driver_exe_path,
                driver_executable_path=driver_exe_path
            )

        return self.driver

    def wait_for_object(self, data, data_type, condition="clickable", wait_max=10):
        try:
            wait = WebDriverWait(self.driver, wait_max)
            if condition == "clickable":
                wait.until(EC.element_to_be_clickable((BY_TYPES[data_type], data)))
            elif condition == "visible":
                wait.until(EC.visibility_of_element_located((BY_TYPES[data_type], data)))
            elif condition == "not_visible":
                wait.until_not(EC.visibility_of_element_located((BY_TYPES[data_type], data)))
            elif condition == "present":
                wait.until(EC.presence_of_element_located((BY_TYPES[data_type], data)))
            else:
                raise Exception("Invalid condition type")

            return True

        except TimeoutException:
            return False

        except Exception as e:
            raise e



    def download_driver(self):
        return ChromeDriverManager().install()

