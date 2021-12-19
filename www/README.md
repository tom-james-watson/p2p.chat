# @p2p.chat/www

@p2p.chat/www is a nextjs website written in Typescript.

## Requirements

Install dependencies:

```bash
npm i
```

## Development

Run the development web app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

@p2p.chat/www can be deployed as a simple static website given it has no server component. It can be easily deployed for free on static site hosting providers such as https://www.render.com or https://www.netlify.com.

Set the `NEXT_PUBLIC_SIGNALLING_URL` environment variable to the URL of your [signalling](../signalling) server.

Build and export the application as a static site:

```bash
npm run build
```

Then simply serve the site from the built `out/` directory.
