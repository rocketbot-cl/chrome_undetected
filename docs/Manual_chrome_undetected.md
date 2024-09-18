# chrome_undetected
  
This module allows you to automate Google Chrome in undetected mode  

*Read this in other languages: [English](Manual_chrome_undetected.md), [Português](Manual_chrome_undetected.pr.md), [Español](Manual_chrome_undetected.es.md)*
  
![banner](imgs/Banner_chrome_undetected.jpg)
## How to install this module
  
To install the module in Rocketbot Studio, it can be done in two ways:
1. Manual: __Download__ the .zip file and unzip it in the modules folder. The folder name must be the same as the module and inside it must have the following files and folders: \__init__.py, package.json, docs, example and libs. If you have the application open, refresh your browser to be able to use the new module.
2. Automatic: When entering Rocketbot Studio on the right margin you will find the **Addons** section, select **Install Mods**, search for the desired module and press install.  


## How to use this module

This module does **NOT** use the default location drivers from Rocketbot, but downloads them automatically. Therefore, an internet connection is required to download the drivers. In case the environment where the robot will run presents network blockages, the following links must be enabled for the driver download to be successful:

- https://storage.googleapis.com/* (URL for downloading the drivers)
- https://googlechromelabs.github.io/chrome-for-testing/* (URL for checking the version of the drivers)

The path where the drivers are downloaded is as follows:
`C:\Users\<user>\.wdm\drivers\chromedriver\win64\<version>`

## Description of the commands

### Open Browser
  
Open a selected browser
|Parameters|Description|example|
| --- | --- | --- |
|URL|URL to access.|https://rocketbot.com/en|
|Port|Port to use in the browser|5002|
|Profile folder (Optional)|Profile folder (leave empty to use default rocketbot folder for testing).|C:/Users/User/Desktop/browser_profile|

### Close Browser
  
Close a selected browser
|Parameters|Description|example|
| --- | --- | --- |
