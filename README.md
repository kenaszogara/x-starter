# X-Starter

CLI tool to quickly scaffold React projects for your next "X" project, with opiniated addons

## Features

- 🚀 **Two Framework Options**: Choose between Next.js or Vite
- 🎨 **shadcn/ui + Tailwind CSS Out of the Box**
- 📦 **PNPM as Package Manager**
- 🔧 **TypeScript Ready**: Full TypeScript configuration included
- 🎯 **ESLint & Prettier**: Code quality tools pre-configured
- 📁 **Opiniated Project Structure**: (src/)
- 🧩 **Pick and Choose Add-Ons**:
  - ⭐ **@tanstack/react-query**
  - ⭐ **zustand**
  - ⭐ **better-auth** (coming soon)

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

npx x-starter my-project
```

The CLI will prompt you to:

1. Enter project name (if not specified)
2. Choose framework (Next.js or Vite)
3. Pick and choose addons

## Project Structure

### Next.js Projects

```
my-nextjs-app/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── [/addons]
├── next.config.js
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
│   ├── index.css
│   └── [/addons]
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── package.json
└── README.md
```

## Roadmap V0:

- [x] @tanstack/react-query (vanila)
- [x] zustand: with provider + slice patterns
- [ ] better-auth: framework agnostic login
- [ ] react-hook-form: with zod as validator
- [ ] @tanstack/table or ag-grid: pick and choose a table framework
- [ ] @hey-api/openapi-ts (vanila): with axios client and minimal setup
- [ ] @hey-api/openapi-ts + @tanstack/react-query: with react-query codegen

## Development

To develop and test this CLI tool:

```bash
# Clone the repository
git clone <repo-url>
cd x-starter

# Install dependencies
pnpm install

# Build the project
pnpm run build

# test locally
pnpm run test
```

## Scripts

- `pnpm run build` - Build the TypeScript project
- `pnpm run dev` - Watch mode for development

## Requirements

- Node.js >= 16.0.0
- pnpm

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
