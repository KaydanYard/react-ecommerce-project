import { Routes, Route, Link } from 'react-router-dom'
import { LoginView } from '../views/public/login.view';
import { SignUpView } from '../views/public/signUp.view';
import { Menu, Icon } from 'semantic-ui-react';
import { NotFound404 } from '../views/public/NotFound404.view';
import { CategoryView } from '../views/public/category.view';
import { SavedItemsView } from '../views/protected/shoppingCart.view';
import { useGlobalContext } from '../contexts/global.context';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { usePreferencesContext } from '../contexts/preferences.context';
import { AccountView } from '../views/protected/account.view';

type ProtectedViewProps = {
  children: ReactNode
}

export function ProtectedView({ children }: ProtectedViewProps) {
  const { state: { loggedIn } } = useGlobalContext()
  const navigate = useNavigate()
  if (!loggedIn) {
    navigate('/login');
  }
  return <>{children}</>;
}

export function ProtectedMenu() {
  const { state: { loggedIn, user }, onLogout } = useGlobalContext()

  return (
    <header>
      <Menu>
        <Menu.Menu position='left'>
          <Menu.Item>
            <Link to="/shopzone"><Icon name='shopping cart'></Icon>Shopper Zone</Link>
          </Menu.Item>

          <Menu.Item>
            <Link to="/shopping-cart"><Icon name='shopping basket'></Icon>Shopping Cart</Link>
          </Menu.Item>
        </Menu.Menu>

        <Menu.Menu position='right'>
          <Menu.Item>
            <Link to="/account">
              <Icon name="user" /> Welcome {user?.firstName}
            </Link>
          </Menu.Item>
          <Menu.Item onClick={() => onLogout?.()}>
            <Link to="/login">
              Log Out
            </Link>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </header>
  )
}

export function PublicMenu() {

  return (
    <header>
      <Menu>
        <Menu.Menu position='left'>
          <Menu.Item>
            <Link to="/shopzone"><Icon name='shop'></Icon>Shopper Zone</Link>
          </Menu.Item>
        </Menu.Menu>

        <Menu.Menu position='right'>
          <Menu.Item>
            <Link to="/login">Log In</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/sign-up">Sign Up</Link>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </header>
  )
}

export function MainRoutes() {
  const { state: { loggedIn, user }, onLogout } = useGlobalContext()
  const { state: { theme } } = usePreferencesContext();

  return (
    <div>
      {loggedIn ? <ProtectedMenu /> : <PublicMenu />}
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/sign-up" element={<SignUpView />} />
        <Route path="/account" element={<ProtectedView><AccountView /></ProtectedView>} />

        <Route path="/shopping-cart">
          <Route path=":id" element={<ProtectedView><SavedItemsView /></ProtectedView>}></Route>
          <Route path="" element={<ProtectedView><SavedItemsView /></ProtectedView>}></Route>
        </Route>

        <Route path="/shopzone">
          <Route path=":categoryId" element={<CategoryView />}></Route>
          <Route path=":categoryId/products/:productId" element={<CategoryView />}></Route>
          <Route path="" element={<CategoryView />}></Route>
        </Route>

        <Route path="*" element={<NotFound404 />} />
      </Routes>
      <footer>
        {/* {theme} */}
      </footer>
    </div >
  )
}
