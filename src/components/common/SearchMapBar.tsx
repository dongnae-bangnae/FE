import { ChangeEvent, FormEvent, useState } from "react";
import SearchIcon  from '../../assets/top/icon-top-searchMap.svg'
import { KakaoPlace, KakaoSearchStatus } from "../../types/kakao";
interface SearchMapBarProps {
	map: any; // kakao.maps.Map
}

function SearchMapBar({ map }: SearchMapBarProps) {
	const [keyword, setKeyword] = useState("");

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
				const coords = new window.kakao.maps.LatLng(firstPlace.y, firstPlace.x);
				map.setCenter(coords);
			} else {
				alert("검색 결과가 없습니다.");
			}
		});
	};

	return (
			<div className="w-full h-[66px] bg-[#FFAC33] flex items-center justify-center">
				<form
					onSubmit={handleSubmit}
					className="flex items-center w-[calc(100%-32px)] max-w-[500px]  bg-white rounded-md outline outline-gray-500"
				>
					<img src={SearchIcon}  alt="검색" className="w-5 h-5  ml-3 filter brightness-0 opacity-50"  />
					<input
						type="text"
						value={keyword}
						onChange={handleChange}
						placeholder="동네명, 장소명 검색"
						className="w-full text-sm px-3 py-3 outline-none placeholder-gray-500"
					/>
				</form>
			</div>
	);
}

export default SearchMapBar;