- [Create an Angular workspace](#create-an-angular-workspace)
- [Generate applications](#generate-applications)
- [Add eslint](#add-eslint)
- [Add Cypress](#add-cypress)

# Create an Angular workspace

```bash
ng new --create-application=false --new-project-root='.' ng-angularfire-testbed
```

```bash
cd ng-angularfire-testbed
```

# Generate applications

```bash
ng generate application --routing --style=css angularfire-app
```

```bash
ng generate application --routing --style=css angularfire-compat-app
```

```bash
ng generate application --routing --style=css firebase-app
```

```bash
ng generate application --routing --style=css firebase-compat-app
```

# Add eslint

```bash
ng add @angular-eslint/schematics
```

```bash
ng g @angular-eslint/schematics:add-eslint-to-project angularfire-app
```

```bash
ng g @angular-eslint/schematics:add-eslint-to-project angularfire-compat-app
```

```bash
ng g @angular-eslint/schematics:add-eslint-to-project firebase-app
```

```bash
ng g @angular-eslint/schematics:add-eslint-to-project firebase-compat-app
```

# Add Cypress

https://github.com/cypress-io/cypress/tree/master/npm/cypress-schematic#readme

```bash
ng add @cypress/schematic
```
