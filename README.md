<section id="head" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

# @molacms/cli

**The Mola CMS all-in-one CLI**

</section>

<section id="tocx" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

- [Command overview](#cli-command-overview)
- [Command reference](#cli-command-reference)
  - [`new`](#command-new)
  - [`help`](#command-help)
  - [`*`](#command-*)
- [Detail API reference](https://mola-cli.lamnhan.com)


</section>

<section id="cli" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="cli-command-overview"><p>Command overview</p>
</a></h2>

The Mola CMS all-in-one CLI

- [`mola new|start|n <theme> <projectName> [appDomain] [appName] [appDescription] --source [value] --deploy [value] --theme [value] --locale [value] --skip-install --skip-git`](#command-new)
- [`mola help`](#command-help)
- [`mola *`](#command-*)

<h2><a name="cli-command-reference"><p>Command reference</p>
</a></h2>

<h3><a name="command-new"><p><code>new</code></p>
</a></h3>

Create a new project.

**Usage:**

```sh
mola new <theme> <projectName> [appDomain] [appName] [appDescription] --source [value] --deploy [value] --theme [value] --locale [value] --skip-install --skip-git
mola start <theme> <projectName> [appDomain] [appName] [appDescription] --source [value] --deploy [value] --theme [value] --locale [value] --skip-install --skip-git
mola n <theme> <projectName> [appDomain] [appName] [appDescription] --source [value] --deploy [value] --theme [value] --locale [value] --skip-install --skip-git
```

**Parameters:**

- `<theme>`: Theme input.
- `<projectName>`: The project name.
- `[appDomain]`: The web app domain name.
- `[appName]`: The web app name.
- `[appDescription]`: The web app description.

**Options:**

- `-s, --source [value]`: Custom theme source (url to .zip).
- `-d, --deploy [value]`: Deploy service (github/firebase/netlify).
- `-t, --theme [value]`: Additional themes (commna-separated).
- `-l, --locale [value]`: Additional locales (commna-separated).
- `-i, --skip-install`: Do not install dependency packages.
- `-g, --skip-git`: Do not initialize a git repository.

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
