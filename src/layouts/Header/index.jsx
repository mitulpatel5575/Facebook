import * as React from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import style from "./Header.module.css";
import logo2 from "../../assets/svg/logo2.svg";
import { SearchBar } from "../../components";
import {
  Home,
  HomeActive,
  Market,
  Watch,
  FriendsActive,
  Friends,
  Notifications,
} from "../../assets/svg";
import HeaderMenu from "./HeaderMenu/HeaderMenu";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import NotificationMenu from "./NotificationMenu/NotificationMenu";
import SearchMenu from "../../components/Search/SearchMenu/SearchMenu";
import { useFetchNotifQuery } from "../../app/features/notification/notificationApi";

const Header = () => {
  const { user } = useSelector((state) => state.user);
  const [showHeaderMenu, setShowHeaderMenu] = React.useState(false);
  const [showNotification, setShowNotification] = React.useState(false);
  const notificationMenu = React.useRef(null);
  const headerMenu = React.useRef(null);
  const [showSearchMenu, setShowSearchMenu] = React.useState(false);
  const { data } = useFetchNotifQuery('', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useOnClickOutside(headerMenu, showHeaderMenu, () => {
    setShowHeaderMenu(false);
  });
  useOnClickOutside(notificationMenu, showNotification, () => {
    setShowNotification(false);
  });
  useOnClickOutside(headerMenu, showHeaderMenu, () => {
    setShowHeaderMenu(false);
  });
  return (
    <header className={style.header}>
      <div className={style.navbar_left}>
        {!showSearchMenu && (
          <Link to="/">
            <img src={logo2} alt="hsjfhjh" className={style.logo} />
          </Link>
        )}
        <div className={style.navbar_search}>
          <SearchBar
            showSearchMenu={showSearchMenu}
            setShowSearchMenu={setShowSearchMenu}
          />
        </div>
      </div>
      {showSearchMenu && (
        <SearchMenu
          showSearchMenu={showSearchMenu}
          setShowSearchMenu={setShowSearchMenu}
        />
      )}

      <div className={style.navbar_middle}>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? `${style.active} ${style.navbar_middle_icon}`
              : `${style.navbar_middle_icon} hover1`
          }
          to="/"
        >
          <HomeActive className={style.active_icon} />
          <Home className={style.notActive_icon} />
        </NavLink>
        <NavLink className={({ isActive }) =>
          isActive
            ? `${style.active} ${style.navbar_middle_icon}`
            : `${style.navbar_middle_icon} hover1`
        } to="/friends"
        >
          <span
            className={style.active_icon}
            style={{ transform: "translateY(10%)" }}
          >
            <FriendsActive />
          </span>
          <span
            className={style.notActive_icon}
            style={{ transform: "translateY(10%)" }}
          >
            <Friends />
          </span>
        </NavLink>
        <NavLink className={`${style.navbar_middle_icon} hover1`} to="#">
          <Watch />
        </NavLink>

        <NavLink className={`${style.navbar_middle_icon} hover1`} to="#">
          <Market />
        </NavLink>
      </div>
      <div className={style.navbar_right}>
        <div ref={notificationMenu}>
          <div
            className={style.circle_icons}
            onClick={() => {
              setShowNotification((prev) => !prev);
            }}
          >
            <Notifications />
            {data?.notseenNotification > 0 && (
              <div
                className={style.notification}
              >
                {data?.notseenNotification}
              </div>
            )}
          </div>
          {showNotification && <NotificationMenu setShowNotification={setShowNotification} />}
        </div>
        <div ref={headerMenu}>
          <div
            className={style.circle_icons}
            onClick={() => {
              setShowHeaderMenu((prev) => !prev);
            }}
          >
            <img
              src={user?.photo}
              alt=""
              className={style.navbar_profile}
            />
          </div>
          {showHeaderMenu && (
            <HeaderMenu setShowHeaderMenu={setShowHeaderMenu} user={user} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
