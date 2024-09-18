# chrome_undetected
  
Este módulo permite que você automatize o Google Chrome no modo undetected  

*Read this in other languages: [English](Manual_chrome_undetected.md), [Português](Manual_chrome_undetected.pr.md), [Español](Manual_chrome_undetected.es.md)*
  
![banner](imgs/Banner_chrome_undetected.jpg)
## Como instalar este módulo
  
Para instalar o módulo no Rocketbot Studio, pode ser feito de duas formas:
1. Manual: __Baixe__ o arquivo .zip e descompacte-o na pasta módulos. O nome da pasta deve ser o mesmo do módulo e dentro dela devem ter os seguintes arquivos e pastas: \__init__.py, package.json, docs, example e libs. Se você tiver o aplicativo aberto, atualize seu navegador para poder usar o novo módulo.
2. Automático: Ao entrar no Rocketbot Studio na margem direita você encontrará a seção **Addons**, selecione **Install Mods**, procure o módulo desejado e aperte instalar.  



## Como usar este módulo

Este módulo **NÃO** utiliza os drivers da localização padrão do Rocketbot, mas os baixa automaticamente. Portanto, é necessário ter uma conexão com a internet para baixar os drivers. Caso o ambiente onde o robô será executado apresente bloqueios de rede, os seguintes links devem ser habilitados para que o download do driver seja bem-sucedido:

- https://storage.googleapis.com/* (URL para baixar os drivers)
- https://googlechromelabs.github.io/chrome-for-testing/* (URL para verificar a versão dos drivers)

O caminho onde os drivers são baixados é o seguinte:
`C:\Users\<usuário>\.wdm\drivers\chromedriver\win64\<versão>`
## Descrição do comando

### Abrir Navegador
  
Abre o navegador selecionado
|Parâmetros|Descrição|exemplo|
| --- | --- | --- |
|URL|URL para acessar.|https://rocketbot.com/pr|
|Porta|Porta a ser usada no navegador|5002|
|Pasta de perfil (Opcional)|Pasta de perfil (deixe em branco para usar a pasta padrão do rocketbot para testes).|C:/Users/Usuário/Desktop/perfil_navegador|

### Fechar Navegador
  
Fecha o navegador selecionado
|Parâmetros|Descrição|exemplo|
| --- | --- | --- |
