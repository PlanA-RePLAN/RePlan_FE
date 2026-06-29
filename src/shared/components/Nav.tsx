import { useLocation, useNavigate } from 'react-router-dom'
import HomeNavIcon from '@/icons/nav/HomeNavIcon'
import GoalNavIcon from '@/icons/nav/GoalNavIcon'
import ChartNavIcon from '@/icons/nav/ChartNavIcon'
import ProfileNavIcon from '@/icons/nav/ProfileNavIcon'

const NAV_ITEMS = [
  { path: '/home', icon: HomeNavIcon, label: '홈' },
  { path: '/goal', icon: GoalNavIcon, label: '목표' },
  { path: '/statics', icon: ChartNavIcon, label: '통계' },
  { path: '/mypage', icon: ProfileNavIcon, label: '마이' },
]

export default function Nav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="flex z-1000 justify-center gap-15 items-center w-full h-27 px-10.5 fixed bottom-0 bg-white border border-bluegray-light-hover">
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path
        const Icon = item.icon
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center "
          >
            <Icon isActive={isActive} />
            <p
              className={`text-xs ${isActive ? 'text-bluegray-black' : 'text-bluegray-normal'}`}
            >
              {item.label}
            </p>
          </button>
        )
      })}
    </div>
  )
}
