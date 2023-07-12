import type { V2_MetaFunction } from '@remix-run/node'

export const meta: V2_MetaFunction = () => [{ title: 'Thumbnailed' }]

export default function Index() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-gray-800 text-white">
      <div className="flex flex-col p-1">
        <h1 className="flex-col items-center justify-center gap-4  text-4xl font-extrabold tracking-wide drop-shadow-xl">
          <div>Preview</div>
          <div className="inline-flex text-[#FF0000]">
            <img
              src="/youtube-logo.png"
              alt="YouTube logo"
              className="mr-2 inline-block w-8 md:w-16"
            />
            <span>YT Thumbnails</span>
          </div>
        </h1>
        <h2 className="flex-col text-lg font-bold  drop-shadow-xl">
          <span className="mr-3 lowercase tracking-wider">within your</span>
          <span className="flex items-center font-mono font-extrabold tracking-wide text-[#7681fa]">
            <img
              src="/discord-logo.png"
              alt="Discord logo"
              className="mr-3 w-6"
            />
            Discord Server
          </span>
        </h2>
      </div>
    </main>
  )
}
