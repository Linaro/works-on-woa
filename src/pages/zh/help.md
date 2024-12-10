---
layout: ../../layouts/InfoLayout.astro
title: 帮助
description: 关于使用 Arm的Windows 兼容软件网站的帮助页面。
---

# 关于本网站的帮助

本网站提供有关多个应用程序和游戏的信息，以及它们在 Arm的Windows 上运行的状态。

应用程序和游戏按类别分组，可以按多个类别进行分类。要查看给定类别的条目，请从条目详细信息页面上的 **Categories** 链接中选择类别，或从搜索栏右侧的类别下拉菜单中选择，然后点击放大镜以执行搜索。可以同时选择多个类别。

对于应用程序，**Compatibility** 字段可以是以下值之一：

| Value     | Meaning                               |
| --------- | ------------------------------------- |
| Compatible| 在 Arm的Windows (WoA) 上运行。          |
| Unknown   | 状态未知。请查看开发者网站以获取更多信息。|

**Version From** 字段显示与 Arm的Windows 兼容的首个已知公开版本的应用。当 **Download** 按钮可用时，点击将导航到 Microsoft Store 产品描述页面或提供应用安装的网页位置。对于 **Unknown** 的应用，将显示 **Website** 按钮而不是 **Download**。点击 **Website** 按钮将导航到应用开发者的主网页，您可以在此检查最新状态，并直接联系开发者请求 Arm的Windows 支持。

有关如何为此网站做出您自己的贡献的信息，无论是对于尚未列出的应用程序，还是提供现有应用程序的状态更新，请阅读 [贡献指南](/zh/contributing)。

对于游戏，**Compatibility** 字段可以是以下值之一：

| Value      | Meaning                               |
| ---------- | ------------------------------------- |
| perfect    | 在 1080p 分辨率下以 60+ FPS 运行，没有影响游戏体验的故障/问题。 |
| playable   | 在 1080p 分辨率下以 30+ FPS 运行，存在影响游戏体验的最小故障/问题。 |
| runs       | 以低于 30 FPS 运行，并且可能存在影响游戏体验的错误。 |
| unplayable | 由于防作弊或其他故障而无法运行。 |

在每个游戏中，您将看到以下字段。下面我们定义了它们的含义。

**Frame Rate:** 游戏的每秒帧数

**Device Configuration:** 用于测试游戏的设备

**OS Version:** 测试游戏的 Windows 操作系统版本

**Driver ID:** 测试游戏的图形驱动程序

**Compatibility Details:** 关于游戏运行情况的进一步信息

**Auto Super Resolution:** Auto SR 使用 AI 来提升游戏的分辨率，让您在游戏中获得更好的 FPS 和增强的视觉质量。

**Auto SR Compatability:** Auto SR 开箱即用意味着它可以在不更改任何设置的情况下运行。选择加入意味着您需要通过 Windows 设置选择加入游戏。

**Auto SR FPS Boost:** 描述启用 Auto SR 后您可以期望的 FPS 提升量。

要查看与自动超分辨率兼容的游戏，请从游戏页面搜索栏右侧的 Auto SR 下拉菜单中选择“yes, out-of-box”和“yes, opt-in”条目。

有关如何为此网站做出您自己的贡献的信息，无论是对于尚未列出的游戏，还是通过添加您自己的报告来贡献给现有游戏，请阅读 [贡献指南](/zh/contributing)。
