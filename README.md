
---

# Hito Extension

This extension supports attendance management, providing a user-friendly interface to streamline tracking work status.

## Features
- Manage attendance with an easy-to-use interface.
- Display and update attendance credentials.
- Timer component to track work hours.

## Installation

### Prerequisites
Ensure you have the following installed:
- **Node.js** and **npm**
- **Vue.js** development environment

### Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd hito_extension
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Duplicate the `.env.example` file and rename it to `.env`. Update any necessary configurations for API endpoints, tokens, or other required settings.

### Build the Extension

To compile the extension for use:

```bash
npm run build
```

The output files will be in the `dist/` directory, which can be loaded into the browser.

## Load the Extension in Chrome

1. Open `chrome://extensions/` in your Chrome browser.
2. Enable **Developer mode** (toggle it on the upper right corner).
3. Click on **Load unpacked** and select the `dist` folder of the project.

## Usage

- **Popup**: The popup allows quick access to attendance information and status updates.
- **Options**: Manage detailed settings and preferences.
- **Background**: Background scripts manage updates and synchronize data with the API.

## Development

For active development with hot-reloading:

```bash
npm run serve
```

## Configuration

- **Plugins**: Configuration for plugins like Axios, Pinia, and Vuetify can be adjusted in the `plugins/` directory.
- **Store**: Stores for attendance (`kintai`) and credentials (`credential`) are managed in the `store/` directory.

--- 