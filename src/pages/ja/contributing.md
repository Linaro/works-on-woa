---
layout: ../../layouts/InfoLayout.astro
title: 貢献する
description: このサイトに貢献する方法
---

# このサイトへの貢献
- <a href="#アプリケーション">アプリケーション</a>
- <a href="#ゲーム">ゲーム</a>

## アプリケーション
アプリの貢献は、<a href="#GitHubを使用して貢献する方法アプリ">GitHubプロジェクト</a>に直接行うか、便利な<a href="#アプリリクエストフォームで貢献する方法">フォームプロセス</a>を使用できます。

### アプリリクエストフォームで貢献する方法
「アプリリクエストフォーム」ボタンをクリックして、アプリリクエストのフォームに入力してください。このフォームを使用して、テストと追加が必要な新しいアプリのリクエストを行ったり、アプリの誤りを知らせたり、新しいアプリデータを提出することができます。技術的な経験がない場合は、Githubではなくこのフォームから貢献することをお勧めします。定義されたスキーマとカテゴリの詳細については、下にスクロールしてください。

<a class="border-white border-2 px-4 py-2 rounded-xl hover:bg-white hover:text-black no-underline" href="/ja/contributing/applications">アプリリクエストフォーム</a>

### GitHubを使用して貢献する方法（アプリ）

自分のGitHubアカウントが必要です。まだ持っていない場合は、https://github.com にアクセスし、ページの右上隅にある**サインアップ**をクリックして、指示に従ってください。

アカウントを作成したら、https://github.com/Linaro/works-on-woa/fork に移動して、このウェブサイトのリポジトリを*フォーク*します（つまり、自分のコピーを作成します）。

リポジトリをフォークしたら、`git clone`コマンドでコンピューターにクローンします。必要な場合は、https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository でさらにガイダンスを確認してください。

リポジトリをクローンしたら、ファイルに必要な変更を加えます。異なるファイルに必要な内容やオプションについては、以下のガイダンスを参照してください。助けが必要な場合は、https://github.com/Linaro/works-on-woa/issues/new でイシューを作成してください。できる限りお手伝いします。

変更を加えたら、自分のリポジトリに[コミット](https://github.com/git-guides/git-commit)し、[プッシュ](https://github.com/git-guides/git-push)します。

最後に、[プルリクエスト](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)を作成して、公式リポジトリに変更をマージしてもらうように依頼します。リクエストはレビューされ、承認されればサイトにマージされます。

**注意してください！** 変更をGitHubにプッシュする前に、ローカルでウェブサイトをビルドすることを**強く**お勧めします。これにより、サイトが正しくビルドされ、貢献にエラーがないことが保証されます。この手順は、READMEファイルの*開発者情報*セクションに記載されています。

#### ファイル内容の詳細

アプリケーションには、提出されたデータの一貫性を確保するための*スキーマ*があります。

各エントリは、`.md`ファイル拡張子の付いたファイルに保存されます。アプリケーションエントリは、`src/content/applications`の下に保存されます。

既存のエントリに関する独自のレポートを貢献する場合、それは適切に`src/content/user_reports_applications`または`src/content/user_reports_games`に保存されるべきです。

各ファイルは以下で構成されています：

- 3つのダッシュ`---`
- 下記の詳細に従ったプロジェクト固有の情報
- 3つのダッシュ`---`
- GitHub Markdown形式の追加ノート

##### アプリケーションスキーマ

アプリケーションエントリに格納される情報は、次のスキーマに従う必要があります：

| フィールド | タイプ | 注記 |
|-|-|-|
| `name` | string | アプリケーションの名前です。 |
| `icon` | string | オプション。`public/icons` 相対のアイコンファイルのパス。最大サイズは512x512。可能であればSVGを使用してください。 |
| `categories` | list | アプリケーションが属する1つ以上のカテゴリのリスト。カテゴリのリストは `src/content/applications_categories` にあります。このフォルダ内のファイル名でカテゴリを参照します。 |
| `display_result` | enum <ul><li>`Compatible`<li>`Unknown`<li>`Unsupported`<li>`Vendor Announced - Launching Soon`</ul> | Arm互換性の表示：<br>Compatible: テストされたアプリケーションはWindows on Armで動作します<br>Unknown: ステータスは不明です<br>Unsupported: 現在、この値は使用されていません<br>Vendor Announced - Launching Soon: 現在、この値は使用されていません |
| `compatibility` | enum <ul><li>`native`<li>`emulation`<li>`no`<li>`unknown`</ul> | Windows on Arm互換性：<br>Native: WoAネイティブサポートが利用可能<br>Emulation: x86/x64エミュレーションで動作<br>No: まだ移植されていない<br>Unknown: ステータスは不明 |
| `version_from` | string | 使用可能なバージョンです。<br><br>ソフトウェアがあるバージョンからコンパイル可能であるが、別のバージョンからのみ公開されている場合（例えば、Pythonはかなり早くからコンパイル可能でしたが、WoAリリースを開始したのは後からです）、ここには一般的にエンドユーザーが使用する公開バージョンを入力します。<br><br>コンパイル可能なバージョン（およびそれに関連する注意事項）は、自由形式でノートセクションに追加できます。 |
| `link` | URL | ソフトウェアのダウンロード先リンクまたはアプリケーションのメインウェブサイト。 |

### アプリケーションユーザー報告スキーマ

ユーザーは、このサイトに追加されたアプリケーションに関する自分の調査結果を追加できます。ファイルは**一意の**ファイル名（`.md` 拡張子付き）を持ち、内容は次のスキーマに従う必要があります：

| フィールド | タイプ | 注記 |
|-|-|-|
| `reporter` | string | オプション。あなたの名前です。 |
| `application` | string | アプリケーションのファイル名から `.md` 拡張子を**含まない**名前です。 |
| `device_configuration` | string | オプション。レポートに影響を与える可能性のある構成に関する情報。 |
| `date_tested` | date | オプション。形式は `YYYY-MM-DD` です。 |
| `compatibility_details` | string | アプリケーションの動作に関するあなたの報告内容です。 |

#### カテゴリ

カテゴリリストは、角括弧`[` で始まり、1つ以上のカテゴリをカンマで区切り、角括弧 `]` で閉じられます。

カテゴリは、前述の適切なカテゴリフォルダ内の `.md` ファイル名と一致する必要があります。

## ゲーム
貢献は、<a href="#github-を使用して貢献する方法-ゲーム">GitHub プロジェクト</a>に直接、または便利な<a href="#ゲームリクエストフォームで貢献する方法">フォームプロセス</a>を通じて行うことができます。

### ゲームリクエストフォームで貢献する方法
「ゲームリクエストフォーム」ボタンをクリックして、以下のフォームにゲームテストの詳細を入力してください。技術的な経験がない場合は、Githubではなくこのフォームから貢献することをお勧めします。定義されたスキーマとカテゴリの詳細については、下にスクロールしてください。

<a class="border-white border-2 px-4 py-2 rounded-xl hover:bg-white hover:text-black no-underline" href="/ja/contributing/games">ゲームリクエストフォーム</a>

### GitHub を使用して貢献する方法 (ゲーム)

GitHub アカウントが必要です。まだアカウントをお持ちでない場合は、https://github.com にアクセスし、ページの右上隅にある **Sign up** をクリックし、指示に従って登録してください。

アカウントを取得したら、https://github.com/Linaro/works-on-woa/fork にアクセスして、この Web サイトのリポジトリを「フォーク」（つまり自分のコピーを作成）してください。

リポジトリをフォークしたら、`git clone` コマンドを使用してコンピュータにクローンします。詳細なガイダンスが必要な場合は、https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository を参照してください。

**注意:** リポジトリをローカルでビルドするには、WSL（Windows Subsystem for Linux）内にクローンする必要があります。

リポジトリをクローンしたら、ファイルに必要な変更を加えてください。必要に応じて、各ファイルの必要な内容とオプションについてのガイダンスが以下にあります。助けが必要な場合は、https://github.com/Linaro/works-on-woa/issues/new で問題を作成していただければ、可能な限りお手伝いいたします。

変更が完了したら、[コミット](https://github.com/git-guides/git-commit)してリポジトリに戻し、GitHub に[プッシュ](https://github.com/git-guides/git-push)します。

最後に、公式リポジトリにマージするために[プルリクエスト](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)を作成します。リクエストはレビューされ、承認されればサイトにマージされます。

**注意！** 変更を GitHub にプッシュする前に、コンピュータでローカルにサイトをビルドすることを強くお勧めします。これにより、サイトが正しくビルドされ、貢献内容にエラーがないことを確認できます。手順については、README ファイルの *Developer Info* セクションを参照してください。

### ファイル内容の詳細

ゲームに関しては、一貫性を確保するために*スキーマ*が定義されています。

各エントリは `.md` ファイル拡張子付きのファイルに保存されます。ゲームエントリは `src/content/games` に保存されます。

既存のエントリに関する自分の報告を投稿する場合は、`src/content/user_reports_games` に保存する必要があります。

各ファイルには以下が含まれます：

- 3つのダッシュ `---`
- 以下に詳述するプロジェクト固有の情報
- 3つのダッシュ `---`
- GitHub Markdown 形式での追加のメモ

#### ゲームスキーマ

| フィールド | 型 | 説明 |
|-|-|-|
| `name` | string | ゲームの名前。 |
| `icon` | string | 任意。アイコンファイルのパスを、`public/icons` に相対的に記述。最大512x512。可能であればSVGを使用。 |
| `categories` | list | ゲームが属する1つ以上のカテゴリのリスト。カテゴリの一覧は `src/content/gamess_categories` にあります。フォルダ内のファイル名で参照。 |
| `publisher` | string | 任意。ゲームの発行者名。 |
| `frame_rate` | string | 任意。ゲームのフレームレート（fps）。 |
| `device_configuration` | string | 任意。ゲームテストに使用したデバイス。 |
| `os_version` | string | 任意。ゲームテストに使用したOSバージョン。 |
| `driver_id` | string | 任意。ゲームテストに使用したグラフィックドライバーのID。 |
| `date_tested` | date | 任意。形式は `YYYY-MM-DD` |
| `compatibility` | enum <ul><li>`perfect`<li>`playable`<li>`runs`<li>`unplayable`</ul> | ゲームの動作状況。詳細はヘルプページを参照。 |
| `compatibility_details` | string | 任意。互換性に関する追加情報。 |
| `auto_super_resolution` | block | 任意。以下の例で構文を参照。 |
| - `compatibility` | enum <ul><li>`yes, out-of-box`<li>`yes, opt-in`<li>`no` <li> `unknown` </ul> | 任意。自動スーパー解像度機能との互換性を示す。opt-in は Windows 設定で機能を有効にする必要があり、out-of-box は設定変更なしで適用されることを意味します。 |
| - `fps_boost` | string | 任意。自動SRがゲームのフレームレートをどの程度向上させるか。 |
| - `opt-in steps` | string | 任意。opt-in のゲームに対する自動SRの有効化手順。 |
| `link` | URL | ソフトウェアをダウンロードできるリンク、またはアプリケーションの公式サイト。 |

`auto_super_resolution` ブロックは任意ですが、存在する場合、`compatibility` 属性が**必須**です。ブロックの形式は以下のようになります：

```
   auto_super_resolution:
      compatibility: yes, out-of-box
```

#### ゲームユーザーレポートスキーマ

ユーザーは、このサイトに追加されたゲームに関する自分の発見を追加できます。ファイルには**ユニーク**なファイル名（`.md`拡張子付き）を使用し、内容は次のスキーマに従う必要があります：

| フィールド | 型 | 説明 |
|-|-|-|
| `reporter` | string | 任意。あなたの名前。 |
| `game` | string | ゲームのファイル名から取得した名前。`.md`拡張子を**除く** |
| `device_configuration` | string | 任意。使用したデバイスの名前。 |
| `date_tested` | date | 任意。形式は `YYYY-MM-DD` |
| `os_version` | string | 任意。システムのOSバージョン。 |
| `driver_id` | string | 任意。システムのグラフィックスドライバID。 |
| `compatibility` | enum <ul><li>`perfect`<li>`playable`<li>`runs`<li>`unplayable`</ul> | ゲームの動作状況。定義の詳細はヘルプページを参照してください。 |
| `compatibility_details` | string | アプリケーションがどのように動作したかに関するレポート。 |
| `auto_super_resolution` | block | 任意。 |
| - `compatibility` | enum <ul><li>`yes, opt-in`<li>`no`<li>`unknown`</ul> | 自動スーパー解像度機能との互換性を示します。opt-in は、Windows設定でこの機能を有効にする必要があることを意味します。 |
| - `fps_boost` | string | 自動SRがゲームのフレームレートをどの程度向上させるか。 |
| - `opt-in steps` | string | 任意。opt-in のゲームに対する自動SRの有効化手順。 |

ユーザーゲームレポートでは、自動スーパー解像度の互換性は `yes, opt-in`、`no` または `unknown` のみとなります。

#### カテゴリ

ゲームのカテゴリリストは、開き角かっこ `[` で始まり、コンマで区切られた1つ以上のカテゴリが続き、閉じ角かっこ `]` で構成されます。

カテゴリは、前述した適切なカテゴリフォルダ内の `.md` ファイルのファイル名と一致する必要があります。
