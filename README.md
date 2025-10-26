# Einvoice

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is almost ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/nest?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Finish your CI setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/kN35X7GOoy)

## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve invoice
```

To create a production bundle:

```sh
npx nx build invoice
```

To see all available targets to run for a project, run:

```sh
npx nx show project invoice
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/nest:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/node:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

-   [Learn more about this workspace setup](https://nx.dev/nx-api/nest?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
-   [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
-   [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
-   [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:

-   [Discord](https://go.nx.dev/community)
-   [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
-   [Our Youtube channel](https://www.youtube.com/@nxdevtools)
-   [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Docker compose

### Xoa data

docker system prune -af

docker compose -f .\docker-compose.provider.yaml up -d

docker compose -f .\docker-compose.provider.yaml down

docker compose -f .\docker-compose.provider.yaml up -d redis

## PostgreSQL

http://localhost:5050/

admin@admin.com /Abc12345

### keycloak

docker compose -f .\docker-compose.provider.yaml up -d keycloak

http://localhost:8180/admin/master/console/
admin/Abc12345

http://localhost:8180/realms/einvoice-app/account
alice/Abc12345

http://localhost:8180/realms/einvoice-app/.well-known/openid-configuration

### Direct access plan ( use user/pass)

POST
http://localhost:8180/realms/einvoice-app/protocol/openid-connect/token

x-www-form-urlencoded

grant_type:password
client_id:einvoice-app
username:alice
password:Abc12345
scope:openid

### Standard access plan

#### Get authorization code

http://localhost:8180/realms/einvoice-app/protocol/openid-connect/auth?

#### get code

Base uri:
http://localhost:8180/realms/einvoice-app/protocol/openid-connect/token

Login on browser :

http://localhost:8180/realms/einvoice-app/protocol/openid-connect/auth?client_id=einvoice-app&response_type=code&scope=openid&redirect_uri=http://localhost:3000/authenticate

Input user: alice
Pass: Abc12345

After login => redirect to client app with code like (use only once time):

b9a15a02-40e1-4f92-b528-40aad9d620e6.e9f98592-7520-401f-ac03-3fba22feb147.8470dabf-71aa-41bd-95d6-f8c82e708310

#### get token

Open postman :

POST
http://localhost:8180/realms/einvoice-app/protocol/openid-connect/token

body (urlencoded)

grant_type:authorization_code
client_id:einvoice-app
code:b9a15a02-40e1-4f92-b528-40aad9d620e6.e9f98592-7520-401f-ac03-3fba22feb147.8470dabf-71aa-41bd-95d6-f8c82e708310
redirect_uri:http://localhost:3000/authenticate

### Create user use admin SDK

POST

http://localhost:8180/admin/realms/einvoice-app/users

Body:

{
"username": "johndoe1",
"enabled": true,
"email" : "codedao.io@gmail.com",
"emailVerified": "true",
"firstName" : "Hoa",
"lastName": "Nguyen",
"credentials": [
{
"type": "password",
"value": "Abc12345",
"temporary": false
}
]
}
