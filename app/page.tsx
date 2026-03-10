import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import MovieRow from '@/components/MovieRow'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <div className="pb-20">
        <MovieRow title="Trending Now" category="trending" />
        <MovieRow title="Action Movies" category="action" />
        <MovieRow title="Comedy Series" category="comedy" />
        <MovieRow title="Drama" category="drama" />
        <MovieRow title="Horror" category="horror" />
      </div>
    </div>
  )
}
