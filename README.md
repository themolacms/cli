<section id="head" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

# @molacms/cli

**The Mola CMS all-in-one CLI**

</section>

<section id="tocx" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

- [Getting started](#getting-started)
- [Command overview](#cli-command-overview)
- [Command reference](#cli-command-reference)
  - [`add`](#command-add)
  - [`build`](#command-build)
  - [`claim`](#command-claim)
  - [`deploy`](#command-deploy)
  - [`docs`](#command-docs)
  - [`e2e`](#command-e2e)
  - [`info`](#command-info)
  - [`new`](#command-new)
  - [`preview`](#command-preview)
  - [`sudo`](#command-sudo)
  - [`test`](#command-test)
  - [`help`](#command-help)
  - [`*`](#command-*)
- [Detail API reference](https://mola-cli.lamnhan.com)


</section>

<section id="getting-started">

## Getting started

- Install globally:

```sh
npm i -g @molacms/cli
```

- Use the global CLI:

```sh
mola new blank myApp
```

See the homepage for more: [https://mola.lamnhan.com](https://mola.lamnhan.com)

</section>

<section id="cli" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="cli-command-overview"><p>Command overview</p>
</a></h2>

The Mola CMS all-in-one CLI

- [`mola add|generate|a|g <input> [params...]`](#command-add)
- [`mola build|b`](#command-build)
- [`mola claim|c <subCommand> [params...]`](#command-claim)
- [`mola deploy|d`](#command-deploy)
- [`mola docs|home|h`](#command-docs)
- [`mola e2e|e`](#command-e2e)
- [`mola info|i`](#command-info)
- [`mola new|start|n <theme> <projectName> [appDomain] [appName] [appDescription] --source [value] --deploy [value] --locale [value] --skin [value] --soul [value] --skip-install --skip-git`](#command-new)
- [`mola preview|p --port [value] --host [value] --i18n`](#command-preview)
- [`mola sudo|sadmin|s <subCommand> [email]`](#command-sudo)
- [`mola test|t`](#command-test)
- [`mola help`](#command-help)
- [`mola *`](#command-*)

<h2><a name="cli-command-reference"><p>Command reference</p>
</a></h2>

<h3><a name="command-add"><p><code>add</code></p>
</a></h3>

Add a components, pages, ...

**Usage:**

```sh
mola add <input> [params...]
mola generate <input> [params...]
mola a <input> [params...]
mola g <input> [params...]
```

**Parameters:**

- `<input>`: An input string
- `[params...]`: List of parameters

<h3><a name="command-build"><p><code>build</code></p>
</a></h3>

Build the app.

**Usage:**

```sh
mola build
mola b
```

<h3><a name="command-claim"><p><code>claim</code></p>
</a></h3>

Manange user claim.

**Usage:**

```sh
mola claim <subCommand> [params...]
mola c <subCommand> [params...]
```

**Parameters:**

- `<subCommand>`: A supported sub-command: get, set
- `[params...]`: List of sub-command parameters

<h3><a name="command-deploy"><p><code>deploy</code></p>
</a></h3>

Deploy the app.

**Usage:**

```sh
mola deploy
mola d
```

<h3><a name="command-docs"><p><code>docs</code></p>
</a></h3>

Open documentation.

**Usage:**

```sh
mola docs
mola home
mola h
```

<h3><a name="command-e2e"><p><code>e2e</code></p>
</a></h3>

E2e test the app.

**Usage:**

```sh
mola e2e
mola e
```

<h3><a name="command-info"><p><code>info</code></p>
</a></h3>

Display project information.

**Usage:**

```sh
mola info
mola i
```

<h3><a name="command-new"><p><code>new</code></p>
</a></h3>

Create a new project.

**Usage:**

```sh
mola new <theme> <projectName> [appDomain] [appName] [appDescription] --source [value] --deploy [value] --locale [value] --skin [value] --soul [value] --skip-install --skip-git
mola start <theme> <projectName> [appDomain] [appName] [appDescription] --source [value] --deploy [value] --locale [value] --skin [value] --soul [value] --skip-install --skip-git
mola n <theme> <projectName> [appDomain] [appName] [appDescription] --source [value] --deploy [value] --locale [value] --skin [value] --soul [value] --skip-install --skip-git
```

**Parameters:**

- `<theme>`: A Mola theme input.
- `<projectName>`: The project name.
- `[appDomain]`: The web app domain name.
- `[appName]`: The web app name.
- `[appDescription]`: The web app description.

**Options:**

- `-s, --source [value]`: Custom Mola theme source (url/path to .zip).
- `-d, --deploy [value]`: Deploy service (github/firebase).
- `-l, --locale [value]`: Change or add locales (commna-separated).
- `-k, --skin [value]`: Change or add Unistylus skins (commna-separated).
- `-o, --soul [value]`: Change Unistylus soul.
- `-i, --skip-install`: Do not install dependency packages.
- `-g, --skip-git`: Do not initialize a git repository.

<h3><a name="command-preview"><p><code>preview</code></p>
</a></h3>

Preview the app.

**Usage:**

```sh
mola preview --port [value] --host [value] --i18n
mola p --port [value] --host [value] --i18n
```

**Options:**

- `-p, --port [value]`: Custom port
- `-h, --host [value]`: Custom host
- `-i, --i18n`: Enable i18n

<h3><a name="command-sudo"><p><code>sudo</code></p>
</a></h3>

Manage super admin account.

**Usage:**

```sh
mola sudo <subCommand> [email]
mola sadmin <subCommand> [email]
mola s <subCommand> [email]
```

**Parameters:**

- `<subCommand>`: A supported sub-command: get, set, remove
- `[email]`: A user email (set)

<h3><a name="command-test"><p><code>test</code></p>
</a></h3>

Unit test the app.

**Usage:**

```sh
mola test
mola t
```

<h3><a name="command-help"><p><code>help</code></p>
</a></h3>

Display help.

**Usage:**

```sh
mola help
```

<h3><a name="command-*"><p><code>*</code></p>
</a></h3>

Any other command is not suppoted.

**Usage:**

```sh
mola <cmd>
```

</section>

<section id="license" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

## License

**@molacms/cli** is released under the [MIT](https://github.com/themolacms/cli/blob/master/LICENSE) license.

</section>
