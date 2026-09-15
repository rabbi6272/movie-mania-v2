import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";

export function EmptyLibrary({ router }: { router: ReturnType<typeof useRouter> }) {
	return (
		<div className="w-full py-14 px-4 flex flex-col items-center justify-center text-center">
			<span className="material-symbols-outlined text-5xl text-gray-300">bookmark_add</span>
			<h2 className="text-xl md:text-2xl font-bold text-gray-600 mt-3">
				Your watchlist is empty
			</h2>
			<p className="text-sm text-gray-400 mt-1 max-w-xs">
				Search for movies and TV shows to start building your library.
			</p>
			<Button
				onClick={() => router.push('/search')}
				className="mt-5 text-sm font-semibold text-white bg-gray-900 rounded-full px-5 py-2 hover:bg-gray-800 transition-colors"
			>
				Browse movies
			</Button>
		</div>
	);
}