// src/pages/OnboardingPage.tsx
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { axiosInstance } from "../apis/axiosInstance";
import CameraIcon from "../assets/icon-camera.svg";
import IconDefault from "../assets/icon-default.svg";
import DefaultProfile from "../assets/icon-defaultProfile.svg";
import IconRedChecked from "../assets/icon-redChecked.svg";
import SearchIcon from "../assets/icon-search.svg";
import Header from "../components/common/Header";
import {
	FULL_BY_SHORT,
	normalizeToId,
	normalizeToShort
} from "../constants/regions";
import { useCompleteOnboarding } from "../hooks/mutations/useCompleteOnboarding";

function OnboardingPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [step, setStep] = useState<1 | 2 | 3>(1);
	const [nickname, setNickname] = useState("");
	const [nicknameError, setNicknameError] = useState("");
	const [areaInput, setAreaInput] = useState("");
	const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
	const [isSearching, setIsSearching] = useState(false);

	// ✅ 이미지 상태를 먼저 선언 (아래에서 사용하므로)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [imageFile, setImageFile] = useState<File | null>(null);

	const { mutateAsync: completeOnboarding, isPending } = useCompleteOnboarding();

	/** ❗normalizeToShort가 실패 시 ""를 줄 수 있어, ""를 실패로 간주하는 안전 헬퍼 */
	const toRealShort = (v?: string | null) => {
		const s = normalizeToShort((v ?? "").trim());
		return s && s.length > 0 ? s : undefined;
	};

	// 체크박스 토글 핸들러
	const handleToggleArea = (raw: string) => {
		// 항상 short를 우선 보관, 실패 시 원문(풀네임) 사용
		const short = toRealShort(raw) ?? raw.trim();
		if (!short) return; // 빈값 차단

		const areaKey = short; // 저장 키는 short(가능하면)
		if (selectedAreas.includes(areaKey)) {
			setSelectedAreas(selectedAreas.filter((a) => a !== areaKey));
		} else {
			if (selectedAreas.length >= 3) return;
			setSelectedAreas([...selectedAreas, areaKey]);
		}
	};

	const handleRemoveArea = (areaToRemove: string) => {
		setSelectedAreas(selectedAreas.filter((area) => area !== areaToRemove));
	};

	// 동기 로컬 검사로 단순화
	const validateNickname = (): boolean => {
		const t = nickname.trim();
		if (!t) {
			setNicknameError("닉네임을 입력해주세요");
			return false;
		}
		if (t.length > 10) {
			setNicknameError("닉네임은 최대 10자입니다.");
			return false;
		}
		setNicknameError("");
		return true;
	};

	const handleNextFromNickname = () => {
		if (validateNickname()) setStep(2);
	};

	const handleAreaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== "Enter") return;
		e.preventDefault();

		const keyword = areaInput.trim();
		if (!keyword) return;

		const short = toRealShort(keyword);
		// 백엔드가 풀네임→ID를 지원하지 않으면 short만 저장하도록 바꿔도 됨
		const areaKey = short ?? keyword;
		if (!areaKey) return;

		if (selectedAreas.length >= 3) return;
		if (selectedAreas.includes(areaKey)) return;

		setSelectedAreas([...selectedAreas, areaKey]);
		setAreaInput("");
	};

	const buildRegionIds = (): number[] => {
		const ids: number[] = [];
		selectedAreas.forEach((name) => {
			const short = toRealShort(name);
			const id =
				(short ? normalizeToId(short) : undefined) ??
				normalizeToId(name.trim());
			if (typeof id === "number" && Number.isFinite(id)) {
				ids.push(id);
			}
		});
		// 중복 제거
		return Array.from(new Set(ids));
	};

	const handleOnboardingSubmit = async () => {
		const t = nickname.trim();
		if (!t) {
			setStep(1);
			setNicknameError("닉네임을 입력해주세요");
			return;
		}
		if (t.length > 10) {
			setStep(1);
			setNicknameError("닉네임은 최대 10자입니다.");
			return;
		}

		const regionIds = buildRegionIds();
		if (regionIds.length < 1 || regionIds.length > 3) {
			alert("좋아하는 동네는 최소 1개, 최대 3개까지 선택할 수 있어요.");
			return;
		}

		try {
			const result = await completeOnboarding({
				nickname: t,
				regionIds,
				imageFile
			});

			// [ADD] 온보딩 완료 여부 확인 (catch는 그대로 둠)
			const completedFromAPI =
				result?.result?.isOnboardingCompleted ?? result?.isOnboardingCompleted;

			const myInfo = await queryClient.fetchQuery({
				queryKey: ["myInfo"],
				queryFn: () =>
					axiosInstance
						.get("/api/member/info")
						.then((r) => r.data?.result ?? r.data),
				staleTime: 0
			});

			const completed = completedFromAPI ?? myInfo?.isOnboardingCompleted;

			if (completed) {
				navigate("/home");
			} else {
				alert("온보딩 완료 상태 확인에 실패했습니다. 다시 로그인 후 시도해주세요.");
			}
		} catch (err: any) {
			const code = err?.response?.data?.code ?? "";
			const DUP = ["NICKNAME_DUPLICATE", "MEMBER4008", "MEMBERA008"];
			const EMPTY = ["NICKNAME_NOT_EXIST", "EMPTY_NICKNAME"];
			const BAD_REGION = ["INVALID_REGION_COUNT", "MEMBERA004", "MEMBER4004"];

			if (DUP.includes(code)) {
				setStep(1);
				setNicknameError("이미 사용 중인 닉네임입니다.");
				return;
			}
			if (EMPTY.includes(code)) {
				setStep(1);
				setNicknameError("닉네임을 입력해주세요");
				return;
			}
			if (BAD_REGION.includes(code)) {
				alert("좋아하는 동네는 최소 1개, 최대 3개까지 선택할 수 있어요.");
				return;
			}
			if (err?.response?.status === 403) {
				alert("보안 토큰이 유효하지 않아요. 다시 로그인 후 시도해주세요.");
				return;
			}

			alert(
				err?.response?.data?.message ??
					"온보딩에 실패했습니다. 다시 시도해주세요."
			);
		}
	};

	const matchedFullAddress = useMemo(() => {
		const t = areaInput.trim();
		const short = toRealShort(t); // 풀네임이 들어와도 short로 정규화(빈문자열 차단)
		return short ? FULL_BY_SHORT.get(short) ?? null : null;
	}, [areaInput]);

	return (
		<div className="w-full max-w-[390px] mx-auto min-h-screen bg-white flex flex-col">
			{/* Header */}
			{step === 1 && <Header title="프로필 수정" underline />}
			{step === 2 && <Header title="" onBack={() => setStep(1)} />}
			{step === 3 && <Header title="" onBack={() => setStep(2)} />}

			{/* STEP 1 */}
			{step === 1 && (
				<>
					{/* 이미지 업로드 영역 */}
					<div className="h-[188px] w-full flex justify-center items-center">
						<div className="relative w-[111px] h-[111px]">
							<input
								type="file"
								accept="image/*"
								id="profile-upload"
								className="hidden"
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) {
										const reader = new FileReader();
										reader.onloadend = () => {
											setPreviewUrl(reader.result as string);
											setImageFile(file);
										};
										reader.readAsDataURL(file);
									}
								}}
							/>
							<label htmlFor="profile-upload" className="cursor-pointer">
								<div className="relative w-[111px] h-[111px]">
									<img
										src={previewUrl || DefaultProfile}
										alt="프로필"
										className="w-full h-full object-cover rounded-full"
									/>
									<img
										src={CameraIcon}
										alt="카메라"
										className="absolute bottom-0 right-0 w-[37.44px] h-[32.222px]
                 filter contrast-[250%] brightness-[0.85] drop-shadow-[0_0_1px_black]"
									/>
								</div>
							</label>
						</div>
					</div>

					{/* 닉네임 */}
					<div className="w-[350px] h-[202px] relative">
						<label
							htmlFor="nickname"
							className="absolute top-[61px] left-[20px] text-[#1E1E1E] font-pretendard text-[14px] font-semibold leading-[18px]"
						>
							닉네임
						</label>

						<input
							id="nickname"
							type="text"
							placeholder="닉네임을 입력해주세요"
							value={nickname}
							onChange={(e) => setNickname(e.target.value)}
							className="
      absolute
      top-[92px]
      left-[20px]
      w-[336px]
      h-[49px]
      px-[16px]
      py-[15px]
      flex items-center gap-[16px] shrink-0
    rounded-[10px]
    border border-[#EBEBED]
    shadow-[0_2px_4px_0_rgba(0,0,0,0.25)]
    placeholder-[#B0B0B8]
    text-[#1E1E1E] text-[16px] font-pretendard
    focus:outline-none
    focus:shadow-[0_2px_4px_0_rgba(255,172,51,0.5)]
    focus:shadow-none
    focus:border-[#FFAC33]
    "
							style={{ fontWeight: 500 }}
						/>

						<style>{`
    input::placeholder {
      color: #B0B0B8;
      font-family: Pretendard;
      font-size: 16px;
      font-weight: 500;
      text-align: left;
    }
  `}</style>

						{nicknameError && (
							<p className="text-red-500 text-sm mt-[160px] px-[20px]">
								{nicknameError}
							</p>
						)}
					</div>

					{/* 버튼 */}
					<div className="mt-auto flex justify-center pb-[30px]">
						<button
							onClick={handleNextFromNickname}
							className={`w-[264px] h-[56px] rounded-[10px] text-[17px] font-bold leading-[150%] flex items-center justify-center transition-all
      ${
				nickname.trim()
					? "bg-[#FFAC33] text-white shadow-[0_2px_4px_0_rgba(255,172,51,0.5)] border border-[#FFAC33]"
					: "bg-white text-black border border-black"
			}`}
						>
							다음으로 넘어가기
						</button>
					</div>
				</>
			)}

			{/* STEP 2 */}
			{step === 2 && (
				<>
					{/* 상단 문구 */}
					<div className="mt-[69px] ml-[42px] mb-[22px]">
						<h2 className="text-[24px] font-normal text-black">
							좋아하는 동네를 알려주세요!
						</h2>
					</div>

					{/* 검색박스 */}
					<div
						onClick={() => setStep(3)}
						className="flex items-center mx-[12.5px] h-[52px] w-[350px] px-[13px] cursor-pointer
             rounded-[12px] border border-[#E0E0E0] bg-white
             shadow-[0_2px_4px_0_rgba(0,0,0,0.25)]"
					>
						<img
							src={SearchIcon}
							alt="검색"
							className="w-[25px] h-[25px] mr-[7px]"
						/>
						<span className="text-[16px] text-[#666]">동네명, 장소명 검색</span>
					</div>

					{/* 최대 3개 선택 */}
					<p className="mt-[22px] ml-[90px] text-[20px] text-[#FF6A00] font-normal font-pretendard leading-none">
						최소 1개, 최대 3개 선택
					</p>

					{/* 선택된 태그 */}
					<div className="flex flex-wrap gap-2 mx-[26px] mt-2">
						{selectedAreas.map((area) => (
							<div
								key={area}
								className="flex items-center bg-white border border-gray-300 px-3 py-1 rounded-full"
							>
								<span>{area}</span>
								<button
									onClick={() => handleRemoveArea(area)}
									className="ml-1 text-gray-500 hover:text-black"
								>
									✕
								</button>
							</div>
						))}
					</div>

					<div className="flex-1" />

					{/* 버튼 */}
					<div className="flex justify-center pb-[30px]">
						<button
							disabled={isPending || selectedAreas.length === 0}
							onClick={handleOnboardingSubmit}
							className={`w-[264px] h-[56px] rounded-[10px] text-[17px] font-bold leading-[150%] flex items-center justify-center gap-[10px] px-[70px] py-[15px]
      ${
				selectedAreas.length === 0
					? "bg-[#D9D9D9] text-gray-500 shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
					: "bg-[#FFAC33] text-white shadow-[4px_4px_4px_rgba(255,170,51,0.25)]"
			}
    `}
						>
							{isPending ? "처리 중..." : "시작하기"}
						</button>
					</div>
				</>
			)}

			{/* STEP 3 */}
			{step === 3 && (
				<div className="relative flex flex-col flex-1">
					{/* 헤더 */}
					<div className="w-full h-[76px] flex items-center justify-center px-5">
						<span className="text-[24px] font-normal text-center w-full">
							좋아하는 동네를 알려주세요!
						</span>
					</div>
					{/* 검색박스 */}
					<div
						className={`flex items-center mx-[12.5px] h-[52px] w-[350px] px-[13px]
    rounded-[12px] border bg-white
    ${
			isSearching
				? "border-[3px] border-[rgba(255,170,51,0.87)] shadow-[4px_4px_4px_rgba(255,170,51,0.25)]"
				: "border-[#E0E0E0] shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
		}`}
					>
						<img
							src={SearchIcon}
							alt="검색"
							className="w-[25px] h-[25px] mr-[7px]"
						/>
						{isSearching ? (
							<input
								type="text"
								className="flex-1 bg-transparent outline-none text-[16px] text-black placeholder-[#666]"
								placeholder="동네명, 장소명 검색"
								value={areaInput}
								onChange={(e) => setAreaInput(e.target.value)}
								onKeyDown={handleAreaKeyDown}
								autoFocus
							/>
						) : (
							<span
								className="text-[16px] text-[#666] cursor-text"
								onClick={() => setIsSearching(true)}
							>
								동네명, 장소명 검색
							</span>
						)}
					</div>

					{/* 검색 결과 리스트 */}
					{matchedFullAddress &&
						(() => {
							const full = matchedFullAddress; // UI 노출은 풀네임
							const short = toRealShort(full); // 선택/저장은 숏
							const isChecked = !!short && selectedAreas.includes(short);

							return (
								<label className="flex items-center gap-[5px] mt-[20px] ml-[20px] cursor-pointer">
									<input
										type="checkbox"
										checked={isChecked}
										onChange={() => handleToggleArea(full)} // 내부에서 short로 저장
										className="hidden"
									/>

									<img
										src={isChecked ? IconRedChecked : IconDefault}
										alt="체크박스 커스텀 아이콘"
										className="w-[25px] h-[25px] flex-shrink-0"
									/>

									<span className="text-[16px] leading-[24px] font-normal font-pretendard text-[#000]">
										{full.split(areaInput).map((part, i, arr) => (
											<span key={i}>
												{part}
												{i !== arr.length - 1 && (
													<span className="text-[#F95F00]">{areaInput}</span>
												)}
											</span>
										))}
									</span>
								</label>
							);
						})()}

					{/* 상단선 + 문구 + 태그 묶음 */}
					<div className="mt-88">
						<div className="w-full border-t border-gray-300" />
						<p className="mt-2 ml-6 text-[14px] font-normal text-[#FF6A00]">
							최소 1개, 최대 3개 선택
						</p>
						<div className="flex flex-wrap gap-2 mx-6 mt-2">
							{selectedAreas.map((area) => (
								<div
									key={area}
									className="flex items-center bg-white border border-gray-300 px-3 py-1 rounded-full"
								>
									<span>{area}</span>
									<button
										onClick={() => handleRemoveArea(area)}
										className="ml-1 text-gray-500 hover:text-black"
									>
										✕
									</button>
								</div>
							))}
						</div>
					</div>

					<div className="absolute bottom-[100px] left-0 w-full border-t border-gray-300" />

					<div className="flex gap-2 mt-auto pb-[30px] px-[63px]">
						<button
							onClick={() => setStep(2)}
							className="w-[110px] h-[45px] rounded-[9px] bg-[#D9D9D9] text-[17px] font-bold leading-[150%]"
						>
							취소
						</button>
						<button
							onClick={() => setStep(2)}
							disabled={selectedAreas.length === 0}
							className={`w-[110px] h-[45px] rounded-[9px] text-[17px] font-bold leading-[150%] ${
								selectedAreas.length === 0
									? "bg-[#D9D9D9] text-gray-500"
									: "bg-[#FF9700] text-white"
							}`}
						>
							확인
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default OnboardingPage;
