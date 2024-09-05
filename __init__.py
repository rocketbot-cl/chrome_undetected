# coding: utf-8
"""
Base para desarrollo de modulos externos.
Para obtener el modulo/Funcion que se esta llamando:
     GetParams("module")

Para obtener las variables enviadas desde formulario/comando Rocketbot:
    var = GetParams(variable)
    Las "variable" se define en forms del archivo package.json

Para modificar la variable de Rocketbot:
    SetVar(Variable_Rocketbot, "dato")

Para obtener una variable de Rocketbot:
    var = GetVar(Variable_Rocketbot)

Para obtener la Opcion seleccionada:
    opcion = GetParams("option")


Para instalar librerias se debe ingresar por terminal a la carpeta "libs"
    
   sudo pip install <package> -t .

"""

import sys
import os
import psutil # type: ignore

base_path = tmp_global_obj["basepath"] # type: ignore
cur_path = os.path.join(base_path, 'modules', 'chrome_undetected', 'libs')

if cur_path not in sys.path:
    sys.path.append(cur_path)

try:
    from undetectedObject import UndetectedBrowser # type: ignore
except Exception as e:
    import traceback
    traceback.print_exc()
    raise e

GetGlobals = GetGlobals # type: ignore
GetParams = GetParams # type: ignore
SetVar = SetVar # type: ignore
PrintException = PrintException # type: ignore

web = GetGlobals('web')
module = GetParams("module")




def terminate_chromedriver(port):
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        if proc.info['name'] == 'chromedriver.exe' and f'--port={port}' in proc.info['cmdline']:
            proc.kill()
            break


if module == "open_browser":

    url = GetParams("url")
    profile_folder = GetParams("profile_folder") if GetParams("profile_folder") else base_path + "/modules/chrome_undetected/default_profile"
    try:
        undetected_chrome = UndetectedBrowser(profile_folder)
        
        browser_driver = undetected_chrome.open()

        web.driver_list[web.driver_actual_id] = browser_driver

        if url:
            browser_driver.get(url)
        else:
            browser_driver.get("https://www.google.com")

    except Exception as e:
        import traceback
        traceback.print_exc()
        print("\x1B[" + "31;40mAn error occurred\x1B[" + "0m")
        PrintException()
        raise e

if module == "close_browser":
    try:
        browser_driver = web.driver_list[web.driver_actual_id]
        mod_chromedriver_port = browser_driver.service.port
        browser_driver.close()
        browser_driver.quit()
    except Exception as e:
        try:
            terminate_chromedriver(mod_chromedriver_port)
        except Exception as e:
            import traceback
            traceback.print_exc()
            raise e
        

if cur_path in sys.path:
    sys.path.remove(cur_path)