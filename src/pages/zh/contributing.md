---
layout: ../../layouts/InfoLayout.astro
title: 贡献
description: 如何为此站点做出贡献
---

# 为此站点做出贡献
- <a href="#应用程序">应用程序</a>
- <a href="#游戏">游戏</a>

## 应用程序
应用程序的贡献可以直接在<a href="#通过-github-进行贡献应用程序">GitHub 项目</a>上完成，也可以通过便捷的<a href="#通过应用请求表单贡献">表单流程</a>提交。

### 通过应用请求表单贡献
点击“应用请求表单”按钮，填写您的应用请求表单。您可以使用此表单请求测试并添加新应用、报告应用错误或提交新的应用数据。如果您没有技术经验，建议通过此表单而非Github进行贡献。向下滚动查看更多关于定义的架构和类别定义的详细信息。

<a class="border-white border-2 px-4 py-2 rounded-xl hover:bg-white hover:text-black no-underline" href="/ja/contributing/applications">应用请求表单</a>

### 通过 GitHub 进行贡献（应用程序）

您将需要一个 GitHub 账号。如果您还没有账号，请访问 https://github.com，点击页面右上角的**注册**，然后按照说明操作。

创建账号后，前往 https://github.com/Linaro/works-on-woa/fork *fork*（即复制）此站点的存储库。

完成 fork 后，使用 `git clone` 命令将其克隆到您的计算机。如果需要更多帮助，请参阅 https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository。

克隆存储库后，对文件进行必要的更改。有关每个文件所需的内容和选项的指导，请参阅下面的说明。如果需要帮助，请在 https://github.com/Linaro/works-on-woa/issues/new 上创建一个 issue，我们将尽力为您提供帮助。

更改完成后，将更改[提交](https://github.com/git-guides/git-commit)到您的存储库，然后将其[推送](https://github.com/git-guides/git-push)回 GitHub。

最后，创建一个[拉取请求](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)以请求将更改合并到官方存储库。您的请求将被审核，如果获得批准，将合并到站点。

**请注意！** 强烈建议您在将更改推送到 GitHub 之前在本地构建网站。这将确保站点正确构建，且您的贡献没有任何错误。请参阅 README 文件中的*开发者信息*部分了解如何执行此操作。

#### 文件内容详情

为了确保提交数据的一致性，应用程序使用了定义的*架构*。

每个条目都存储在 `.md` 文件扩展名的文件中。应用程序条目存储在 `src/content/applications` 下。

如果您贡献的内容是关于现有条目的报告，请将其适当存储在 `src/content/user_reports_applications` 或 `src/content/user_reports_games` 中。

每个文件包括：

- 三个破折号`---`
- 以下项目特定的信息
- 三个破折号`---`
- GitHub Markdown 格式的任何附加说明

##### 应用程序模式

存储在应用程序条目中的信息必须遵循以下模式：

| 字段 | 类型 | 备注 |
|-|-|-|
| `name` | string | 应用程序的名称。 |
| `icon` | string | 可选。图标文件的路径，相对于 `public/icons`。最大尺寸为512x512。如有可能，请使用SVG格式。 |
| `categories` | list | 应用程序所属的一个或多个类别列表。类别列表位于 `src/content/applications_categories`。通过此文件夹中的文件名引用类别。 |
| `display_result` | enum <ul><li>`Compatible`<li>`Unknown`<li>`Unsupported`<li>`Vendor Announced - Launching Soon`</ul> | Arm兼容性显示：<br>Compatible: 测试的应用程序可以在Windows on Arm上运行<br>Unknown: 状态未知<br>Unsupported: 当前未使用此值<br>Vendor Announced - Launching Soon: 当前未使用此值 |
| `compatibility` | enum <ul><li>`native`<li>`emulation`<li>`no`<li>`unknown`</ul> | Windows on Arm兼容性：<br>Native: 支持WoA原生<br>Emulation: 通过x86/x64仿真运行<br>No: 尚未移植<br>Unknown: 状态未知 |
| `version_from` | string | 软件可用的版本。<br><br>对于可以从一个版本编译的软件，但仅从另一个版本公开（例如，Python在WoA版本发布之前就可以编译），在此处输入通常用户可访问的公开版本。<br><br>可以在备注部分自由添加可编译的版本（及相关说明）。 |
| `link` | URL | 软件下载链接或应用程序的主网站。 |

### 应用程序用户报告模式

用户可以添加关于已添加到此站点的应用程序的发现。文件必须有**唯一**的文件名（扩展名为 `.md`），并且内容必须遵循以下模式：

| 字段 | 类型 | 备注 |
|-|-|-|
| `reporter` | string | 可选。您的姓名。 |
| `application` | string | 应用程序文件名中的名称，不包括 `.md` 扩展名。 |
| `device_configuration` | string | 可选。可能会影响报告的配置相关信息。 |
| `date_tested` | date | 可选。格式为 `YYYY-MM-DD`。 |
| `compatibility_details` | string | 您对应用程序运行情况的报告。 |

#### 类别

类别列表以方括号 `[` 开始，由一个或多个逗号分隔的类别组成，并以方括号 `]` 结束。

类别必须与前面指定的适当类别文件夹中的 `.md` 文件名匹配。

## 游戏
可以直接向<a href="#通过-github-贡献游戏">GitHub 项目</a>贡献，或使用方便的<a href="#通过游戏请求表单贡献">表单流程</a>。

### 通过游戏请求表单贡献
点击“游戏请求表单”按钮，填写以下表单中的游戏测试详情。如果您没有技术经验，建议通过此表单而非Github进行贡献。向下滚动查看更多关于定义的架构和类别定义的详细信息。

<a class="border-white border-2 px-4 py-2 rounded-xl hover:bg-white hover:text-black no-underline" href="/ja/contributing/games">游戏请求表单</a>

### 通过 GitHub 贡献（游戏）

您需要拥有自己的 GitHub 帐户。如果您还没有，请访问 https://github.com，点击页面右上角的 **Sign up** 并按照说明操作。

创建账户后，访问 https://github.com/Linaro/works-on-woa/fork 将本网站的存储库*分叉*（即创建您自己的副本）。

分叉存储库后，使用 `git clone` 命令将其克隆到您的计算机。如果需要更多帮助，请访问 https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository。

**注意：** 您需要将存储库克隆到 WSL（Windows Subsystem for Linux）中。除非在 WSL 中，否则本地构建将失败。

克隆存储库后，按照需要对文件进行更改。每个文件的必要内容和可选内容的指导如下。如有需要，请在 https://github.com/Linaro/works-on-woa/issues/new 创建问题，我们会尽力提供帮助。

完成更改后，将更改 [提交](https://github.com/git-guides/git-commit)到您自己的存储库，然后[推送](https://github.com/git-guides/git-push)回 GitHub。

最后，创建一个[拉取请求](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)请求将您的更改合并到官方存储库。请求将会被审核，若获得批准，则合并到网站中。

**请注意！** 强烈建议您在将更改推送回 GitHub 之前，尝试在计算机上本地构建该网站。这将确保网站正确构建，并且您的贡献没有任何错误。有关说明，请参阅 README 文件中的*开发人员信息*部分。

### 文件内容详细信息

对于游戏，有一个定义的*模式*以确保数据一致性。

每个条目都存储在扩展名为 `.md` 的文件中。游戏条目存储在 `src/content/games` 中。

如果您要提交您对现有条目的报告，则应将其存储在 `src/content/user_reports_games` 中。

每个文件包含：

- 3 个短划线 `---`
- 下文详述的项目特定信息
- 3 个短划线 `---`
- 以 GitHub Markdown 格式添加的附加说明

#### 游戏模式

| 字段 | 类型 | 备注 |
|-|-|-|
| `name` | string | 游戏的名称。 |
| `icon` | string | 可选。相对于 `public/icons` 的图标文件路径。最大512x512。若可能，请使用SVG格式。 |
| `categories` | list | 游戏所属的一个或多个类别的列表。类别列表可在 `src/content/gamess_categories` 中找到。类别通过此文件夹中的文件名引用。 |
| `publisher` | string | 可选。游戏发行商的名称。 |
| `frame_rate` | string | 可选。游戏的帧数（FPS）。 |
| `device_configuration` | string | 可选。测试游戏时使用的设备。 |
| `os_version` | string | 可选。测试游戏时使用的操作系统版本。 |
| `driver_id` | string | 可选。测试游戏时使用的图形驱动程序ID。 |
| `date_tested` | date | 可选。格式为 `YYYY-MM-DD` |
| `compatibility` | enum <ul><li>`perfect`<li>`playable`<li>`runs`<li>`unplayable`</ul> | 游戏的运行情况。有关定义的更多信息，请参阅帮助页面。 |
| `compatibility_details` | string | 可选。关于兼容性的任何附加信息。 |
| `auto_super_resolution` | block | 可选。语法见以下示例。 |
| - `compatibility` | enum <ul><li>`yes, out-of-box`<li>`yes, opt-in`<li>`no` <li> `unknown` </ul> | 可选。表示与自动超级分辨率功能的兼容性。opt-in 意味着需要在 Windows 设置中启用此功能，而 out-of-box 意味着无需更改任何设置即可应用自动 SR。 |
| - `fps_boost` | string | 可选。自动 SR 对游戏帧速率的提升程度。 |
| - `opt-in steps` | string | 可选。为 opt-in 游戏启用自动 SR 的步骤。 |
| `link` | URL | 软件的下载链接或应用程序的官方网站。 |

`auto_super_resolution` 块是可选的，但如果存在，则属性 `compatibility` **必须**存在。块的格式如下：

```
   auto_super_resolution:
      compatibility: yes, out-of-box
```

#### 游戏用户报告模式

用户可以添加有关已添加到本网站的游戏的个人发现。文件可以具有任何**唯一**的文件名（带有 `.md` 扩展名），内容必须遵循以下模式：

| 字段 | 类型 | 备注 |
|-|-|-|
| `reporter` | string | 可选。您的姓名。 |
| `game` | string | 游戏的文件名中的名称，即**不含**`.md`扩展名 |
| `device_configuration` | string | 可选。您使用的设备名称。 |
| `date_tested` | date | 可选。格式为 `YYYY-MM-DD` |
| `os_version` | string | 可选。系统的操作系统版本。 |
| `driver_id` | string | 可选。系统的图形驱动程序ID。 |
| `compatibility` | enum <ul><li>`perfect`<li>`playable`<li>`runs`<li>`unplayable`</ul> | 游戏的运行情况。定义的更多信息请参阅帮助页面。 |
| `compatibility_details` | string | 您的应用运行报告。 |
| `auto_super_resolution` | block | 可选。 |
| - `compatibility` | enum <ul><li>`yes, opt-in`<li>`no`<li>`unknown`</ul> | 表示与自动超级分辨率功能的兼容性。opt-in 意味着需要在 Windows 设置中启用此功能。 |
| - `fps_boost` | string | 自动 SR 对游戏帧速率的提升程度。 |
| - `opt-in steps` | string | 可选。为 opt-in 游戏启用自动 SR 的步骤。 |

请注意，对于用户游戏报告，自动超级分辨率兼容性只能为 `yes, opt-in`、`no` 或 `unknown`。

#### 类别

游戏类别列表以方括号 `[` 开始，包含一个或多个以逗号分隔的类别，并以方括号 `]` 结束。

类别必须与前面指定的相应类别文件夹中的 `.md` 文件名匹配。
