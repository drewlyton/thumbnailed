import type { V2_MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { Button } from '~/components/ui/button'

export const meta: V2_MetaFunction = () => [{ title: 'Thumbnailed' }]

export default function Index() {
  return (
    <>
      <NavBar />
      <main className="flex flex-grow flex-col justify-center px-3 pb-14">
        <div className="flex flex-col gap-3 sm:items-center">
          <h1 className="flex flex-col text-5xl font-extrabold tracking-wide drop-shadow-xl sm:flex-row lg:text-7xl">
            <div className="mb-3 sm:mb-0 sm:mr-3">Preview</div>
            <div className="inline-flex items-center text-[#FF0000]">
              <img
                src="/youtube-logo.png"
                alt="YouTube logo"
                className="flex-0 mr-3 w-12 sm:mr-2 lg:w-16"
              />
              <span>thumbnails</span>
            </div>
          </h1>
          <h2 className="flex flex-col text-5xl font-bold drop-shadow-xl  sm:flex-row lg:text-7xl">
            <div className="mb-3 mr-3 lowercase tracking-wider sm:mb-0">
              within
            </div>
            <span className="inline-flex items-center font-extrabold tracking-wide text-[#7681fa]">
              <img
                src="/discord-logo.png"
                alt="Discord logo"
                className="mr-3 w-9 sm:w-9 lg:w-16"
              />
              <span>discord</span>
            </span>
          </h2>
        </div>
        <div className="mt-8 flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
          <Button className="font-mono" asChild size={'lg'}>
            <Link to={'https://discord.gg/uTbz3UgmCR'} target="_blank">
              <span className="mr-2 text-lg">/</span>
              <span>Try it</span>
            </Link>
          </Button>
          <Button
            variant={'secondary'}
            size={'lg'}
            className="font-mono"
            asChild
          >
            <Link
              to={
                'https://discord.com/api/oauth2/authorize?client_id=1118996288579571843&permissions=277025442880&scope=bot%20applications.commands'
              }
              target="_blank"
            >
              <span className="mr-2 text-lg">+</span>
              <span>Install it</span>
            </Link>
          </Button>{' '}
        </div>
      </main>
      <Footer />
    </>
  )
}

function NavBar() {
  return (
    <nav className="container flex items-center px-3 py-4">
      <div className="inline-flex flex-1 items-center gap-2">
        <img src="logo.png" width={'20px'} alt="Thumbnailed logo" />
        <span className="font-mono text-xs text-gray-300">
          <span className="mr-2">/</span>thumbnailed
        </span>
      </div>
      <div>
        <Button
          className="inline-flex items-center gap-2 font-mono text-xs text-gray-300"
          asChild
          variant={'ghost'}
        >
          <Link to={'https://google.com'} target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span>contribute</span>
          </Link>
        </Button>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="sticky bottom-0 bg-gray-900 px-1 py-2">
      <p className="text-center font-mono text-xs lowercase text-gray-300 sm:text-sm">
        Made with ❤️ by{' '}
        <Link
          to={'https://www.drewis.cool'}
          target="_blank"
          className="underline"
        >
          Drew Lyton
        </Link>
      </p>
    </footer>
  )
}
