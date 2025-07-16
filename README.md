<p align="center">
    <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" align="center" width="30%">
</p>
<p align="center"><h1 align="center">SAIA-CELLPHONE-OS-BACKEND</h1></p>
<p align="center">
	<em><code>BY THIAGO SAQUETTE</code></em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/saquettepj/saia-cellphone-os-backend?style=flat&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/saquettepj/saia-cellphone-os-backend?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/saquettepj/saia-cellphone-os-backend?style=flat&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/saquettepj/saia-cellphone-os-backend?style=flat&color=0080ff" alt="repo-language-count">
</p>
<p align="center">Built with the tools and technologies:</p>
<p align="center">
	<img src="https://img.shields.io/badge/Node.js-339933.svg?style=flat&logo=node.js&logoColor=white" alt="Node.js">
	<img src="https://img.shields.io/badge/Fastify-000000.svg?style=flat&logo=Fastify&logoColor=white" alt="Fastify">
	<img src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" alt="npm">
	<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
	<img src="https://img.shields.io/badge/Vitest-6E9F18.svg?style=flat&logo=Vitest&logoColor=white" alt="Vitest">
	<br>
	<img src="https://img.shields.io/badge/Docker-2496ED.svg?style=flat&logo=Docker&logoColor=white" alt="Docker">
	<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white" alt="TypeScript">
	<img src="https://img.shields.io/badge/GitHub%20Actions-2088FF.svg?style=flat&logo=GitHub-Actions&logoColor=white" alt="GitHub%20Actions">
	<img src="https://img.shields.io/badge/Prisma-2D3748.svg?style=flat&logo=Prisma&logoColor=white" alt="Prisma">
	<img src="https://img.shields.io/badge/Zod-3E67B1.svg?style=flat&logo=Zod&logoColor=white" alt="Zod">
	<img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white" alt="ESLint">
</p>
<br>

##  Table of Contents

- [ Overview](#-overview)
- [ Features](#-features)
- [ Project Structure](#-project-structure)
- [ Getting Started](#-getting-started)
  - [ Prerequisites](#-prerequisites)
  - [ Installation](#-installation)
  - [ Usage](#-usage)
  - [ Testing](#-testing)
- [ Project Roadmap](#-project-roadmap)
- [ Contributing](#-contributing)

---

## Overview

<code>SAIASYSTEM is a comprehensive web service for managing companies in the services and retail sectors. It allows you to register, manage, and securely store essential information about customers, employees, suppliers, orders, products, and services in a secure environment compliant with the Brazilian General Data Protection Law (LGPD). Designed to optimize processes and centralize operations, it offers flexible subscription plans and integration with Mercado Pago.</code>

---

## Features

<code>-> Complete Management: Registration, updating, and secure storage of information about customers, employees, and suppliers.
-> Order and Product Control: Management of sales and service orders, order printing, inventory control, and status tracking.
-> Security and Compliance: Implementation of security best practices, sensitive data encryption, and consent management in compliance with LGPD.
-> Flexible Subscription Models: Monthly, semiannual, and annual plans with integrated payment via Mercado Pago.</code>

---

##  Project Structure

```sh
└── saia-cellphone-os-backend/
    ├── .github
    │   └── workflows
    ├── Dockerfile
    ├── bucket.ts
    ├── docker-compose.yml
    ├── env.example
    ├── instrument.ts
    ├── package.json
    ├── pnpm-lock.yaml
    ├── prisma
    │   ├── migrations
    │   ├── schema.prisma
    │   └── seed.ts
    ├── src
    │   ├── @types
    │   ├── app.ts
    │   ├── config
    │   ├── dtos
    │   ├── emails
    │   ├── enums
    │   ├── env
    │   ├── errors
    │   ├── http
    │   ├── i18n
    │   ├── interfaces
    │   ├── repositories
    │   ├── server.ts
    │   ├── test
    │   ├── useCases
    │   ├── utils
    │   └── vitest-environments
    ├── tsconfig.json
    └── vite.config.mjs
```
---
##  Getting Started

###  Prerequisites

Note: This project uses pnpm as the default package manager for faster installations and better workspace handling. However, you can also use the standard npm package manager if you prefer. All dependencies and scripts are compatible with npm as well.

Before getting started with saia-cellphone-os-backend, ensure your runtime environment meets the following requirements:

- **Programming Language:** TypeScript
- **Package Manager:** Npm
- **Container Runtime:** Docker


###  Installation

Install saia-cellphone-os-backend using one of the following methods:

**Build from source:**

1. Clone the saia-cellphone-os-backend repository:
```sh
❯ git clone https://github.com/saquettepj/saia-cellphone-os-backend
```

2. Navigate to the project directory:
```sh
❯ cd saia-cellphone-os-backend
```

3. Install the project dependencies:


**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm install
```


**Using `docker`** &nbsp; [<img align="center" src="https://img.shields.io/badge/Docker-2CA5E0.svg?style={badge_style}&logo=docker&logoColor=white" />](https://www.docker.com/)

```sh
❯ docker build -t saquettepj/saia-cellphone-os-backend .
```




###  Usage
Run saia-cellphone-os-backend using the following command:
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm start
```


**Using `docker`** &nbsp; [<img align="center" src="https://img.shields.io/badge/Docker-2CA5E0.svg?style={badge_style}&logo=docker&logoColor=white" />](https://www.docker.com/)

```sh
❯ docker run -it {image_name}
```


###  Testing
Run the test suite using the following command:
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm test
```


---
## Project Roadmap

- [X] **`Terms of Use`**: Draft and structure the Webservice Terms of Use in accordance with LGPD and best contractual practices.
- [X] **`Adhesion Agreement`**: Draft the Adhesion Agreement with plans, terms, payment methods, and data protection clauses.
- [X] **`Customer, Employee, and Supplier Registration`**: Implement registration modules with required and optional fields.
- [X] **`Secure Data Storage`**: Set up storage with security measures and LGPD compliance.
- [X] **`External APIs`**: Integrate automatic queries via APIs (CNPJ, postal code, and public data services).
- [X] **`Password Recovery`**: Implement password recovery exclusively via the registered email address.
- [X] **`Subscription Plans`**: Create Monthly, Semiannual, and Annual subscription plans.
- [X] **`Free Trial Period`**: Provide 7 days of free access for new users.
- [X] **`Multilingual Support`**: Make the interface available in other languages.
- [X] **`Data Visualization`**: Create views to display company data in tables and generate graphical reports.
- [X] **`Advanced Reporting`**: Implement customizable dashboards with charts and filters.
- [X] **`Requested Features by Store Owners`**: Develop a list management system tailored to retail workflows.
- [X] **`Payment System via PIX and Credit Card`**: Enable integrated payment processing using PIX and credit card transactions.

---

##  Contributing

- **💬 [Join the Discussions](https://github.com/saquettepj/saia-cellphone-os-backend/discussions)**: Share your insights, provide feedback, or ask questions.
- **🐛 [Report Issues](https://github.com/saquettepj/saia-cellphone-os-backend/issues)**: Submit bugs found or log feature requests for the `saia-cellphone-os-backend` project.
- **💡 [Submit Pull Requests](https://github.com/saquettepj/saia-cellphone-os-backend/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/saquettepj/saia-cellphone-os-backend
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="left">
   <a href="https://github.com{/saquettepj/saia-cellphone-os-backend/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=saquettepj/saia-cellphone-os-backend">
   </a>
</p>
</details>

---

