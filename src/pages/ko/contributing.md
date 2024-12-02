---
layout: ../../layouts/InfoLayout.astro
title: 기여하기
description: 이 사이트에 기여하는 방법
---

# 이 사이트에 기여하기
- <a href="#애플리케이션">애플리케이션</a>
- <a href="#게임">게임</a>

## 애플리케이션
애플리케이션 기여는 <a href="#github를-통한-기여-방법-애플리케이션">GitHub 프로젝트</a>를 통해 직접 하거나, 편리한 <a href="#앱-요청-양식을-통해-기여하는-방법">폼 작성 방식</a>으로 제출할 수 있습니다.

### 앱 요청 양식을 통해 기여하는 방법
‘앱 요청 양식’ 버튼을 클릭하고 앱 요청 양식을 작성하세요. 이 양식을 통해 테스트 및 추가할 새로운 앱을 요청하거나, 앱에 대한 오류를 알리거나, 새로운 앱 데이터를 제출할 수 있습니다. 기술 경험이 없는 경우, Github 대신 이 양식을 통해 기여하는 것을 권장합니다. 정의된 스키마와 카테고리 정의에 대한 자세한 내용은 아래로 스크롤하여 확인하세요.

<a class="border-white border-2 px-4 py-2 rounded-xl hover:bg-white hover:text-black no-underline" href="/ja/contributing/applications">앱 요청 양식</a>

### GitHub를 통한 기여 방법 (애플리케이션)

GitHub 계정이 필요합니다. 계정이 없다면 https://github.com 으로 이동하여, 페이지 오른쪽 상단의 **Sign up**을 클릭하고 지시에 따라 계정을 만드세요.

계정이 생긴 후, https://github.com/Linaro/works-on-woa/fork 로 가서 이 사이트의 리포지토리를 *포크* (즉, 사본 만들기)하세요.

포크가 완료되면, `git clone` 명령을 사용하여 컴퓨터에 리포지토리를 클론합니다. 추가 지침이 필요하면 https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository 를 참조하세요.

클론한 리포지토리에서 파일에 필요한 변경 사항을 적용합니다. 각 파일에 필요한 필수 및 선택적 콘텐츠에 대한 가이드는 아래에서 확인할 수 있습니다. 도움이 필요하면 https://github.com/Linaro/works-on-woa/issues/new 에서 이슈를 생성해 주세요. 최선을 다해 도움을 드리겠습니다.

변경 사항을 완료한 후 [커밋](https://github.com/git-guides/git-commit)하고, [푸시](https://github.com/git-guides/git-push)하여 GitHub에 반영합니다.

마지막으로, 공식 리포지토리에 변경 사항을 병합하도록 요청하는 [풀 리퀘스트](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)를 만듭니다. 요청이 검토되며, 승인되면 사이트에 병합됩니다.

**주의 사항!** 변경 사항을 GitHub에 반영하기 전에 로컬 컴퓨터에서 웹사이트를 빌드해보는 것이 **강력히** 권장됩니다. 이를 통해 사이트가 올바르게 빌드되며, 기여에 오류가 없는지 확인할 수 있습니다. 자세한 내용은 README 파일의 *개발자 정보* 섹션을 참조하세요.

#### 파일 콘텐츠 세부 정보

기여 데이터의 일관성을 보장하기 위해 애플리케이션에는 정의된 *스키마*가 사용됩니다.

각 항목은 `.md` 파일 확장자로 저장됩니다. 애플리케이션 항목은 `src/content/applications`에 저장됩니다.

기존 항목에 대한 보고서를 기여하는 경우 적절히 `src/content/user_reports_applications` 또는 `src/content/user_reports_games`에 저장합니다.

각 파일에는 다음이 포함됩니다:

- 세 개의 대시 `---`
- 프로젝트별 세부 정보
- 세 개의 대시 `---`
- GitHub Markdown 형식의 추가 메모

##### 애플리케이션 스키마

애플리케이션 항목에 저장된 정보는 다음 스키마를 따라야 합니다:

| 필드 | 타입 | 참고 사항 |
|-|-|-|
| `name` | string | 애플리케이션의 이름입니다. |
| `icon` | string | 선택 사항. `public/icons` 에 상대적인 아이콘 파일 경로. 최대 512x512. 가능하면 SVG를 사용하세요. |
| `categories` | list | 애플리케이션이 속한 하나 이상의 카테고리 목록. 카테고리 목록은 `src/content/applications_categories` 에 있습니다. 이 폴더의 파일 이름으로 카테고리를 참조합니다. |
| `display_result` | enum <ul><li>`Compatible`<li>`Unknown`<li>`Unsupported`<li>`Vendor Announced - Launching Soon`</ul> | 표시된 Arm 호환성:<br>Compatible: 테스트된 앱이 Windows on Arm에서 작동합니다<br>Unknown: 상태를 알 수 없습니다<br>Unsupported: 현재 이 값은 사용되지 않습니다<br>Vendor Announced - Launching Soon: 현재 이 값은 사용되지 않습니다 |
| `compatibility` | enum <ul><li>`native`<li>`emulation`<li>`no`<li>`unknown`</ul> | Windows on Arm 호환성:<br>Native: WoA 네이티브 지원이 가능<br>Emulation: x86/x64 에뮬레이션으로 작동<br>No: 아직 이식되지 않음<br>Unknown: 상태를 알 수 없음 |
| `version_from` | string | 사용할 수 있는 버전입니다.<br><br>소프트웨어가 특정 버전에서 컴파일할 수 있지만 다른 버전에서만 공개된 경우(예: Python은 상당히 일찍 컴파일할 수 있었지만 WoA 릴리스를 시작한 것은 나중이었음), 대부분의 최종 사용자가 원하는 공개 버전을 여기에 입력해야 합니다.<br><br>컴파일 가능한 버전(및 관련된 주의 사항)은 노트 섹션에 자유롭게 추가할 수 있습니다. |
| `link` | URL | 소프트웨어 다운로드 링크 또는 애플리케이션의 메인 웹사이트. |

### 애플리케이션 사용자 보고 스키마

사용자는 이 사이트에 추가된 애플리케이션에 대한 자신의 발견 사항을 추가할 수 있습니다. 파일은 **고유한** 파일 이름(확장자는 `.md`)을 가져야 하며, 내용은 다음 스키마를 따라야 합니다:

| 필드 | 타입 | 참고 사항 |
|-|-|-|
| `reporter` | string | 선택 사항. 사용자 이름입니다. |
| `application` | string | 애플리케이션 파일의 이름에서 `.md` 확장자를 **제외한** 이름입니다. |
| `device_configuration` | string | 선택 사항. 보고서에 영향을 미칠 수 있는 구성에 대한 정보입니다. |
| `date_tested` | date | 선택 사항. 형식은 `YYYY-MM-DD`입니다. |
| `compatibility_details` | string | 애플리케이션 실행에 대한 사용자 보고 내용입니다. |

#### 카테고리

카테고리 목록은 대괄호 `[`로 시작하고, 쉼표로 구분된 하나 이상의 카테고리로 구성되며, 대괄호 `]`로 끝납니다.

카테고리는 앞서 지정된 적절한 카테고리 폴더 내의 `.md` 파일 이름과 일치해야 합니다.

## 게임
<a href="#github를-통한-기여-방법-게임">GitHub 프로젝트</a>에 직접 기여하거나, 편리한<a href="#게임-요청-양식을-통해-기여하는-방법">양식 프로세스</a>를 통해 기여할 수 있습니다.

### 게임 요청 양식을 통해 기여하는 방법
‘게임 요청 양식’ 버튼을 클릭하고 아래의 게임 테스트 세부 정보를 입력하세요. 기술 경험이 없는 경우, Github 대신 이 양식을 통해 기여하는 것을 권장합니다. 정의된 스키마와 카테고리 정의에 대한 자세한 내용은 아래로 스크롤하여 확인하세요.

<a class="border-white border-2 px-4 py-2 rounded-xl hover:bg-white hover:text-black no-underline" href="/ja/contributing/games">게임 요청 양식</a>

### GitHub를 통한 기여 방법 (게임)

개인 GitHub 계정이 필요합니다. 아직 계정이 없는 경우, https://github.com 에 접속하여 오른쪽 상단의 **가입하기**를 클릭한 후 지침에 따라 진행하십시오.

계정을 얻은 후, https://github.com/Linaro/works-on-woa/fork 에 접속하여 이 웹사이트의 리포지토리를 *포크*(즉, 본인만의 사본 생성)하십시오.

리포지토리를 포크한 후, `git clone` 명령어를 사용하여 컴퓨터에 클론하십시오. 자세한 가이드는 https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository 에서 확인할 수 있습니다.

**주의:** 로컬에서 리포지토리를 빌드하려면, WSL (Windows Subsystem for Linux) 내에서 클론해야 합니다.

리포지토리를 클론한 후, 파일에 필요한 변경을 가하십시오. 필요한 경우 아래에서 각 파일의 필수 및 선택적 콘텐츠에 대한 지침을 확인할 수 있습니다. 도움이 필요하면, https://github.com/Linaro/works-on-woa/issues/new 에 이슈를 작성해 주시면 가능한 한 돕겠습니다.

변경을 완료한 후 [커밋](https://github.com/git-guides/git-commit)한 다음, [푸시](https://github.com/git-guides/git-push)하여 GitHub에 되돌려 놓습니다.

마지막으로, 공식 리포지토리에 병합을 요청하는 [풀 리퀘스트](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)를 생성하십시오. 요청은 검토 후 승인되면 사이트에 병합됩니다.

**주의!** 변경 사항을 GitHub에 푸시하기 전에 컴퓨터에서 로컬로 사이트를 빌드해 볼 것을 강력히 권장합니다. 이를 통해 사이트가 올바르게 빌드되고 기여 내용에 오류가 없는지 확인할 수 있습니다. 자세한 내용은 README 파일의 *개발자 정보* 섹션을 참조하십시오.

### 파일 내용 세부 정보

게임의 경우 일관성을 유지하기 위해 *스키마*가 정의되어 있습니다.

각 항목은 `.md` 파일 확장자를 가진 파일에 저장됩니다. 게임 항목은 `src/content/games`에 저장됩니다.

기존 항목에 대한 본인의 보고서를 기여하는 경우, `src/content/user_reports_games`에 저장해야 합니다.

각 파일에는 다음이 포함됩니다:

- 3개의 대시 `---`
- 아래에 자세히 설명된 프로젝트 관련 정보
- 3개의 대시 `---`
- GitHub Markdown 형식의 추가 메모

#### 게임 스키마

| 필드 | 유형 | 설명 |
|-|-|-|
| `name` | string | 게임의 이름입니다. |
| `icon` | string | 선택 사항입니다. `public/icons`에서 상대 경로로 사용될 아이콘 파일의 경로. 최대 512x512. 가능하다면 SVG를 사용하세요. |
| `categories` | list | 게임이 속한 하나 이상의 카테고리 목록입니다. 카테고리 목록은 `src/content/gamess_categories`에 있습니다. 폴더 내의 파일 이름으로 참조됩니다. |
| `publisher` | string | 선택 사항입니다. 게임의 배급사 이름입니다. |
| `frame_rate` | string | 선택 사항입니다. 게임의 프레임률입니다. |
| `device_configuration` | string | 선택 사항입니다. 게임을 테스트하는 데 사용된 장치입니다. |
| `os_version` | string | 선택 사항입니다. 게임 테스트에 사용된 OS 버전입니다. |
| `driver_id` | string | 선택 사항입니다. 게임 테스트에 사용된 그래픽 드라이버의 ID입니다. |
| `date_tested` | date | 선택 사항입니다. 형식은 `YYYY-MM-DD`입니다. |
| `compatibility` | enum <ul><li>`perfect`<li>`playable`<li>`runs`<li>`unplayable`</ul> | 게임의 실행 가능 여부. 정의에 대한 자세한 내용은 도움말 페이지를 참조하세요. |
| `compatibility_details` | string | 선택 사항입니다. 호환성에 대한 추가 정보입니다. |
| `auto_super_resolution` | block | 선택 사항입니다. 구문은 아래 예시를 참조하세요. |
| - `compatibility` | enum <ul><li>`yes, out-of-box`<li>`yes, opt-in`<li>`no` <li> `unknown` </ul> | 선택 사항입니다. 자동 슈퍼 해상도 기능과의 호환성을 나타냅니다. opt-in은 Windows 설정에서 기능을 활성화해야 하며, out-of-box는 설정 변경 없이 적용됨을 의미합니다. |
| - `fps_boost` | string | 선택 사항입니다. 자동 SR이 게임의 프레임 속도를 얼마나 높이는지. |
| - `opt-in steps` | string | 선택 사항입니다. opt-in 게임에 대한 자동 SR 활성화 단계입니다. |
| `link` | URL | 소프트웨어를 다운로드할 수 있는 링크 또는 애플리케이션의 공식 웹사이트입니다. |

`auto_super_resolution` 블록은 선택 사항이지만, 존재할 경우 `compatibility` 속성이 **필수**입니다. 블록의 형식은 다음과 같습니다:

```
   auto_super_resolution:
      compatibility: yes, out-of-box
```

#### 게임 사용자 보고서 스키마

사용자는 이 사이트에 추가된 게임에 대한 자신의 발견을 추가할 수 있습니다. 파일에는 `.md` 확장자로 **고유한** 파일 이름이 있어야 하며, 내용은 다음 스키마를 따라야 합니다:

| 필드 | 유형 | 설명 |
|-|-|-|
| `reporter` | string | 선택 사항입니다. 이름을 입력하세요. |
| `game` | string | 게임 파일의 이름에서 가져온 게임 이름. 즉, `.md` 확장자를 **제외** |
| `device_configuration` | string | 선택 사항입니다. 사용한 장치의 이름입니다. |
| `date_tested` | date | 선택 사항입니다. 형식은 `YYYY-MM-DD`입니다. |
| `os_version` | string | 선택 사항입니다. 시스템의 OS 버전입니다. |
| `driver_id` | string | 선택 사항입니다. 시스템의 그래픽 드라이버 ID입니다. |
| `compatibility` | enum <ul><li>`perfect`<li>`playable`<li>`runs`<li>`unplayable`</ul> | 게임의 실행 가능 여부입니다. 정의에 대한 자세한 내용은 도움말 페이지를 참조하세요. |
| `compatibility_details` | string | 응용 프로그램이 실행된 방식에 대한 보고서입니다. |
| `auto_super_resolution` | block | 선택 사항입니다. |
| - `compatibility` | enum <ul><li>`yes, opt-in`<li>`no`<li>`unknown`</ul> | 자동 슈퍼 해상도 기능과의 호환성을 나타냅니다. opt-in은 Windows 설정에서 기능을 활성화해야 함을 의미합니다. |
| - `fps_boost` | string | 자동 SR이 게임의 프레임 속도를 얼마나 높이는지. |
| - `opt-in steps` | string | 선택 사항입니다. opt-in 게임에 대한 자동 SR 활성화 단계입니다. |

사용자 게임 보고서에서는 자동 슈퍼 해상도 호환성이 `yes, opt-in` 또는 `no` 또는 `unknown`으로만 표시될 수 있습니다.

#### 카테고리

게임 카테고리 목록은 대괄호 `[`로 시작하고, 쉼표로 구분된 하나 이상의 카테고리와 닫는 대괄호 `]`로 구성됩니다.

카테고리는 이전에 지정된 적절한 카테고리 폴더의 `.md` 파일 이름과 일치해야 합니다.
