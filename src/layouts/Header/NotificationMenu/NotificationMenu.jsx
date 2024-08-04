import { Link } from "react-router-dom";
import { useDeleteNotifMutation, useFetchNotifQuery, useIsNotifSeenMutation } from "../../../app/features/notification/notificationApi";
import style from "./Notification.module.css";
import moment from "moment";
import chekedlike from "../../../assets/svg/like.svg";
import trash from "../../../assets/svg/trash.svg";
import { NotificationSkeleton } from "../../../components";
import * as React from "react";
import Portal from "../../../utils/Portal";

function NotificationMenu({ setShowNotification }) {
  const [deleteNotif] = useDeleteNotifMutation() 
  const { data, isLoading, isSuccess } = useFetchNotifQuery();
  const [isNotifSeen] = useIsNotifSeenMutation();
  const [active, setActive] = React.useState(null);
  const [show, setShow] = React.useState(false)

  return (
    <div className={style.notif_menu} >

      <h2>Notifications</h2>
      <div >
        {!isLoading &&
          isSuccess &&
          data.notifies &&
          (data?.notifies?.length > 0
            ? data?.notifies?.map((notification) => (

              <div
                className={`${style.notification} hover2`}
                key={notification._id}
                id={notification._id}
                onMouseOver={() => {
                  setShow(true)
                  setActive(notification._id);
                }}
                onMouseLeave={() => {
                  setShow(false)
                  setActive(null);
                }}
              >
                {notification._id === active && show &&
                  (<Portal id={notification._id}>
                    <div className={`${style.trashIcon} smaller_circle`} onClick={() => deleteNotif(notification._id)}>
                      <img src={trash} alt="trashIcon" />
                    </div>
                  </Portal>
                  )

                }
                <Link
                  className={style.content}
                  to={`${notification.url}`}
                  onClick={() => {
                    setShowNotification(false)
                    isNotifSeen(notification?._id)
                  }}
                >
                  <div className={style.image}>
                    <img src={notification?.sender?.photo} alt="" />
                    {notification.type === "react" ? (
                      <img className={style.type} src={chekedlike} alt="" />
                    ) : (
                      ""
                    )}
                  </div>
                  <div className={style.content2} >
                    <span>{notification.content}</span>
                    <span className={style.time}>
                      {moment(notification?.createdAt).fromNow()}
                    </span>
                  </div>
                  <div>
                    {notification.seen === false && (
                      <p
                        style={{
                          background: `#5c6e58`,
                          width: "9px",
                          height: "9px",
                          borderRadius: "100%",
                        }}
                      />
                    )}
                  </div>

                </Link>
              </div>
            ))
            : "No Notification")}
        {isLoading && (
          <>
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </>
        )}
      </div>
    </div>
  );
}
const memoizedNotificationMenu = React.memo(NotificationMenu)

export default memoizedNotificationMenu;
