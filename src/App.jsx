import Logo from './assets/images/take/take.svg'
import arrowUpRight from './assets/images/icons/arrow-up-right.svg'
import MenuButton from './components/search/MenuButton'
import AccountButton from './components/search/AccountButton'
import SearchButton from './components/search/SearchButton'
import SiteAudioToggle from './components/search/SiteAudioToggle'


function App() {
  return (
    <>
      <header>
        <nav className="container grid items-center py-2">
          <div className="grid-span-1">
            <img src={Logo} alt="" className="logo" />
          </div>

          <MenuButton />

          <div className="header-actions">
            <div className="action-buttons flex gap-2">
              <SearchButton />
              <SiteAudioToggle />
            </div>

            <AccountButton
  label="Minha Conta"
  icon={arrowUpRight}
  direction={{ x: 1, y: -1 }}
/>
          </div>
        </nav>
      </header>
    </>
  )
}

export default App
