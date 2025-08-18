// SearchMapBar.tsx
import { ChangeEvent, FormEvent } from "react";
import SearchIcon2 from "../../assets/top/icon-searchMap2.png";
import SearchHome from "../../assets/top/icon-top-searchMap-home.png";
import { KakaoPlace, KakaoSearchStatus } from "../../types/kakao";
import { useMapViewStore } from "../../stores/mapViewStore";

interface SearchMapBarProps {
	map: any; // kakao.maps.Map
	onChangeCenter: (lat: number, lng: number) => void;
}

function SearchMapBar({ map, onChangeCenter }: SearchMapBarProps) {
	const { keyword, hasSearched, setKeyword, setHasSearched } = useMapViewStore();

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setKeyword(e.target.value);
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!keyword.trim()) return alert("검색어를 입력해 주세요.");
		if (!map) return;

		const ps = new window.kakao.maps.services.Places();
		ps.keywordSearch(keyword, (data: KakaoPlace[], status: KakaoSearchStatus) => {
			if (status === window.kakao.maps.services.Status.OK) {
				const firstPlace = data[0];
				const lat = parseFloat(firstPlace.y);
				const lng = parseFloat(firstPlace.x);
				const coords = new window.kakao.maps.LatLng(firstPlace.y, firstPlace.x);
				map.setCenter(coords);
				onChangeCenter(lat, lng);
				setHasSearched(true); // 검색됨 표시 유지
			} else {
				alert("검색 결과가 없습니다.");
			}
			(document.activeElement as HTMLElement)?.blur();
		});
	};

	return (
		<div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-full px-4 max-w-[500px]">
			<form
				onSubmit={handleSubmit}
				className={`relative flex items-center w-full bg-white rounded-md outline outline-gray-300 shadow shadow-gray-500 transition
					${hasSearched ? "" : "focus-within:outline-none focus-within:ring-3 focus-within:ring-[#FFAC33] focus-within:shadow focus-within:shadow-amber-400"}`}
			>
				<img
					src={hasSearched ? SearchHome : SearchIcon2}
					alt="검색"
					className={` ml-3 ${hasSearched ? "w-5 h-5" : "w-4 h-4 filter brightness-0 opacity-70"}`}
				/>
				<input
					type="text"
					value={keyword}
					onChange={handleChange}
					onFocus={() => hasSearched && setHasSearched(false)}
					placeholder="동네명, 장소명 검색"
					className="w-full text-sm px-3 py-3 outline-none placeholder-gray-500"
				/>
				{keyword.length > 0 && !hasSearched && (
					<button
						type="button"
						onClick={() => setKeyword("")}
						className="absolute right-5 text-gray-400 hover:text-gray-600"
					>
						<span className="text-xl font-light">✕</span>
					</button>
				)}
			</form>
		</div>
	);
}

export default SearchMapBar;
