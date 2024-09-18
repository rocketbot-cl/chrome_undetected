import subprocess
import undetected_chromedriver_uc as uc
from webdriver_manager_uc.chrome import ChromeDriverManager


class UndetectedBrowser:
    def __init__(self, folderPath=" ", port="5002"):
        self.driver = None
        self.profile_path = folderPath if folderPath else " "
        self.browser_path = 'start "" chrome'
        self.port = port

    def launch_browser(self):
        subprocess.Popen(" ".join([self.browser_path, "--remote-debugging-port="+self.port, "--user-data-dir=" + self.profile_path + ""]), shell=True)

    def open(self):
        self.launch_browser()
        driver_exe_path = self.download_driver()
        options = uc.ChromeOptions()
        options.add_argument("--no-sandbox")
        options.debugger_address = f"127.0.0.1:{self.port}"
        user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15'
        options.add_argument(f'user-agent={user_agent}')
        options.user_data_dir = self.profile_path
        self.driver = uc.Chrome(options=options, browser_executable_path=driver_exe_path, executable_path=driver_exe_path, driver_executable_path=driver_exe_path)

        return self.driver



    def download_driver(self):
        return ChromeDriverManager().install()

