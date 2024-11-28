# Sistema gestor de la historia clinica FRONT-END
- this project is the consumer of the Historia clinica server.

----

# Dependencies
- [mysql_server_8.0.34](https://dev.mysql.com/downloads/mysql/)
- [nodejs&npm_20.9.0](https://nodejs.org/en)

# References
- [react_official_documentation](https://react.dev/learn)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md)
- [react-router](https://reactrouter.com)
- [react-icons](https://react-icons.github.io/react-icons/)
- [Prop_types](https://www.npmjs.com/package/prop-types)
- [react_pdf](https://react-pdf.org)
- [Babel](https://babeljs.io/)
- [SWC](https://swc.rs/)

# Credits
- [loading_animation](https://css-loaders.com/factory/#l7)
- [home_option_card](https://uiverse.io/Alaner-xs/sweet-seahorse-62)
- [error_page_#9](https://webdeasy.de/en/html-css-404-page-templates/)
- [HTML_elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [pop_up_modal](https://blog.logrocket.com/creating-reusable-pop-up-modal-react/)
- [http_status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#information_responses)
- [login_css](https://codepen.io/ayush602/pen/mdQJreW)

---

# Colors
- for the light theme
>- buttons: #128bcc
>- links: #3a60a4
>- tables options: #1589c9
>- tables th background-color: #c3cfd4
>- disable-content: #f3f3f3

----
# Installation
1. Clone the repository
```shell
git clone https://gihub.com/user_name/repo_name
```
2. Install **NPM** dependencies
```shell
npm i
```
3. create environment variables.
>- In the root folder create the file: **ENV** with ->
```env
VITE_APP_API= # server URL or domain
```
4. make sure the server is active otherwise an *Error* page will be render
5. start the project
```shell
npm run dev
```
6. In the server there will be an *admin* user created before you start the client, so use that user and create another one in the UI application.

----

# TODO
- [ ] add to the navigation bar the active tab colors.
- [ ] add a search options for the pages that show historia table.
- [ ] add the user name in the PDF render phase.
- [ ] better text fields style for the PDF.
- [ ] validation for the PDF depedency that has errors.

----

# Completed TODO
- [x] in PDF generation use the *reference* historia field to render the updated content.
- [x] revisar y validar la recuperación de contraseña para que sea más seguro el proceso.
- [x] generar historia clínica completa con los datos del paciente, si el paciente tiene más de 1 documento se juntan los documentos.
- [-] make validations to the numeric fields
- [-] make meaning reports about the *service* or about the *historia clínica* no incluir hasta revisión.
- [x] add `useBeforeUnload` in any *form* like page to save the state in the *local storage*
- [x] add an option in login to recover password.
- [x] make grammar corrections of all text fields in the pages.
- [x] change style of title in table pages, show in center *historia clínica* and for the table title use the *paciente/user* name
- [x] if the user already has a session active give the option to close that session
- [x] fix error pages
- [x] add `useBlocker` in any page that has important stuff going on
- [x] the current PDF page doesn't render multiple pages correctly
- [x] verify the user pages when name is used, replace it witht the *identificacion*
- [x] rename all the english words with spanish.
- [x] cuando un paciente es atendido es necesario que despues de un tiempo se haga una cita de control la cual también registra historia clínica pero con algunos datos menos
- [x] implement *jotai* state manager or try once.
- [x] add theme state change light to dark and the other way around, using [jotai](https://jotai.org)
- [x] implement the functionality for generate pdf from historia table
- [x] to update add enable/diable checkbox for each one of the components to include in the update operation, if the component checkbox have false as value it will be excluded from the operation as it's not render in the application.
- [x] add scroll options for the pages that need it.
- [x] add page for password change, only admin user have access to this page.
- [x] validate the update pages specially the *paciente* and *encabezado* fields because some of them *should never* be allow to be modified
- [x] agregar en label algun indicador para identificar campos obligatorios
- [x] in the form components add the disable/enable option
- [x] acudiente añadir parentesco
- [x] add paciente update page
- [x] make the page pdf generation more stylish for download 
- [x] acudiente y celular del acudiente
- [x] cambiar a español
- [x] procedencia y residencia entre parentesis departamenteo
- [x] add the pdf generation process where or decide
- [x] when selecting a genero if the option is other make the field an input to get the type of genero
- [x] when selecting *facultad* automatically filter the *programa* to only those of the same *facultad*
- [x] add the option to delete an user - when a deleting a user redirect to another page to make sure the action is intended also when the icon is clicked show a pop-up to confirm the action before redirecting.
- [x] add the option to update or change user rol - *time_limit* if the user is *transitorio*
- [x] create popup windows in order to cancel or accept the user actions, example, when the user wants to register a new historia, when its submitted make a pop up window and if the user cancels do not register.
- [x] using modal component make the confirm phase when the user *POST* historias, right now it need 2 click's in order to insert historias content and historia references.
- [x] using cookies make permission to the pages.
- [x] if the user is *admin* make something more
- [x] use lazy loading for the route components
- [x] make the user be able to register historia only for the current logged user
- [x] add a home page or component for the options that only the logged user can perform, like, register *pacietne*, register historia, register user, generate pdf, etc.
- [x] add the list of historias by user
- [x] add the historias register when the *paciente* doesn't exists
- [x] implement pop up for notifications
- [x] using react router loader make sure to redirect if there is no cookie of authentication setted

----

# Disclaimer
- this project is for educational purposes.
- frphevgl vffhrf ner aot taken into account.
