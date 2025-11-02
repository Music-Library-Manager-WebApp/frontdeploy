'use client'
import { useAuth } from "../context/authcontext"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Header from "@/components/layout/Header"
import Album from '../album/page'
import Artist from "../artist/page"
import Song from '../songs/page'
import Dashboard from '../dashboard/page'

export const buttons = {
  artist: '/images/artist.png',
  album: '/images/album.png',
  song: '/images/song.png'
}

export default function Home() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeView, setActiveView] = useState<'dashboard' | 'artist' | 'album' | 'songs'>('dashboard')

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user])

  const renderComponent = () => {
    switch (activeView) {
      case 'artist': return <Artist />
      case 'album': return <Album />
      case 'songs': return <Song />
      default: return <Dashboard />
    }
  }

  if (!user) return null // prevents flicker before redirect

  return (
    <div className="min-h-screen bg-[#FFF7F0]">
      <Header />

      <div className='flex mt-10 justify-center gap-6'>
        <button
          className='w-32 h-32 bg-amber-200 rounded-lg shadow-md flex flex-col items-center justify-center text-lg font-medium cursor-pointer hover:bg-amber-300 transition'
          onClick={() => setActiveView('artist')}
        >
          <p>Artist</p>
          <Image src={buttons.artist} width={40} height={40} alt="Artist" />
        </button>

        <button
          className='w-32 h-32 bg-amber-200 rounded-lg shadow-md flex flex-col items-center justify-center text-lg font-medium cursor-pointer hover:bg-amber-300 transition'
          onClick={() => setActiveView('songs')}
        >
          <p>Songs</p>
          <Image src={buttons.song} width={40} height={40} alt="Songs" />
        </button>

        <button
          className='w-32 h-32 bg-amber-200 rounded-lg shadow-md flex flex-col items-center justify-center text-lg font-medium cursor-pointer hover:bg-amber-300 transition'
          onClick={() => setActiveView('album')}
        >
          <p>Album</p>
          <Image src={buttons.album} width={40} height={40} alt="Album" />
        </button>
      </div>

      <div className="mt-10 px-4">{renderComponent()}</div>

      <div className="flex justify-center mt-10">
        <button
          onClick={() => { logout(); router.push('/login') }}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
