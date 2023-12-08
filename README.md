# ui-builder-react

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Implementation roadmap

### Constructor core
- [x] Support for Mono components. Sometimes we don't need to have two separate components for viewing and editing. We can use the same component for both purposes
- [x] Descriptor parameters propagation. We might have cases when the parent descriptor should affect on the way the child component is displayed
- [x] Descriptors insertion
- [x] Descriptors removal
- [ ] Descriptor moving
  - [x] Basic moving logic
  - [ ] Binding to the new parent mode. This mode should move the data in the data document to a new place
  - [ ] Visual control to move descriptors up and down under the same parent
  - [ ] Think about the way to validate if the descriptor can be moved to a new parent when using drag&drop
- [ ] Refactor carousel component so that it can show how to implement complex components
- [x] Save/load simulation. To verify the descriptors and data documents are modified in a correct way we need to have a way to "save" and reload the product from the memory. This will help validating the logic responsible for sorting, bindings etc
- [ ] Data document localization
- [ ] API integration

... more items to come.

### Web portal
- [ ] Authorization
- [ ] Localization (https://locize.com/blog/react-i18next/)
- [ ] Pages
  - [ ] Layout
  - [ ] Login page
  - [ ] Main page after login
  - [ ] Products page
  - [ ] Product page (with the constructor). May be useful: https://github.com/josdejong/jsoneditor
  - [ ] Create passport page
  - [ ] Passports page
  - [ ] Preview passport page
- [ ] Constructor
  - [ ] Styling for constructor elements (like buttons to insert and delete descriptors)
  - [ ] Drag&drop support
  - [ ] Components
    - [ ] Layout components
    - [ ] Basic components
    - [ ] Complex components

### General
- [ ] Extract constructor to a module
- [ ] Create app with view-only constructor mode to display passports

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run build-production`

Same as `npm run build` but creates a build artifacts without sourcemaps. That will make the build smaller but you won't be able to debug it.

### `npm run eject`

> No, you aren't gonna need that! Use `craco.config.js` instead.

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

You can see how to customize the react build process in the [craco documentation](https://craco.js.org/docs/).

Learn about how to use the redux toolkit [here](https://redux-toolkit.js.org/usage/usage-guide).

Familiarize yourself with the basic mechanisms of redux-saga [here](https://redux-saga.js.org/docs/basics/DeclarativeEffects).

As we are using the MUI visual component library you may want to check out the [MUI Core documentation](https://mui.com/material-ui/getting-started/usage/).

To learn React, check out the [React documentation](https://reactjs.org/).
