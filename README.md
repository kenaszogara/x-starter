# X-Starter

A CLI tool to quickly scaffold React projects with Next.js or Vite, including Tailwind CSS and shadcn/ui.

## Features

- 🚀 **Two Framework Options**: Choose between Next.js or Vite
- 🎨 **Tailwind CSS Integration**: Optional Tailwind CSS setup with PostCSS
- 🧩 **shadcn/ui Support**: Optional shadcn/ui component library setup
- 📦 **Package Manager Choice**: Support for pnpm and npm
- 🔧 **TypeScript Ready**: Full TypeScript configuration included
- 🎯 **ESLint & Prettier**: Code quality tools pre-configured
- 📁 **Modern Project Structure**: Best practices folder organization
- 🔀 **Git Integration**: Optional git repository initialization

## Installation

```bash
npm install -g x-starter
# or use directly with npx
npx x-starter my-awesome-app
```

## Usage

### Interactive Mode

```bash
npx x-starter
```

The CLI will prompt you to:

1. Enter project name
2. Choose framework (Next.js or Vite)
3. Include Tailwind CSS
4. Include shadcn/ui components
5. Choose package manager (pnpm or npm)
6. Initialize git repository

### Command Line Options

```bash
npx x-starter my-project --framework nextjs --no-git
```

Available options:

- `--framework <nextjs|vite>` - Choose the framework
- `--no-tailwind` - Skip Tailwind CSS setup
- `--no-shadcn` - Skip shadcn/ui setup
- `--no-pnpm` - Use npm instead of pnpm
- `--no-git` - Skip git initialization

## Examples

### Next.js with Tailwind and shadcn/ui

```bash
npx x-starter my-nextjs-app --framework nextjs
```

### Vite with Tailwind but no shadcn/ui

```bash
npx x-starter my-vite-app --framework vite --no-shadcn
```

### Minimal Vite setup

```bash
npx x-starter my-minimal-app --framework vite --no-tailwind --no-git
```

## Project Structure

### Next.js Projects

```
my-nextjs-app/
├── src/
│   └── app/
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── next.config.js
├── tailwind.config.js (if Tailwind enabled)
├── postcss.config.js (if Tailwind enabled)
├── tsconfig.json
├── package.json
└── README.md
```

### Vite Projects

```
my-vite-app/
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
├── tailwind.config.js (if Tailwind enabled)
├── postcss.config.js (if Tailwind enabled)
├── tsconfig.json
├── tsconfig.node.json
├── package.json
└── README.md
```

## Development

To develop and test this CLI tool:

```bash
# Clone the repository
git clone <your-repo-url>
cd x-starter

# Install dependencies
npm install

# Build the project
npm run build

# Test locally
node dist/index.js test-project --framework nextjs
```

## Scripts

- `npm run build` - Build the TypeScript project
- `npm run dev` - Watch mode for development
- `npm run prepublishOnly` - Build before publishing

## Requirements

- Node.js >= 16.0.0
- npm, pnpm, or yarn

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
