import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";

export function GuestHeroSection({ router }: { router: ReturnType<typeof useRouter> }) {
	return (
		<section className="w-full py-10 md:py-16 px-4 text-center">
			<div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
				<span className="material-symbols-outlined text-4xl text-gray-500">theaters</span>
			</div>
			<h1 className="text-3xl md:text-4xl font-nunito font-bold text-gray-900 leading-tight">
				Discover movies worth watching
			</h1>
			<p className="text-sm md:text-base text-gray-500 mt-2 max-w-full mx-auto">
				Search millions of titles, build your watchlist and share it with friends.
			</p>
			<div className="flex items-center justify-center gap-3 mt-6">
				<Button
					onClick={() => router.push('/search')}
					varient="primary"
					size="md"
					icon="search"
				>
					Browse movies
				</Button>
				<Button
					onClick={() => router.push('/signup')}
					varient="primary"
					size="md"
					icon="person_add"
				>
					Create account
				</Button>
			</div>
		</section>
	);
}