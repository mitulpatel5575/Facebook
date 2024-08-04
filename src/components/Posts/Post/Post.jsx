import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../../../app/features/modal/modalSlice";
import * as component from "../../index";
import CommentForm from "./Comments/CommentForm";
import chekedlike from "../../../assets/svg/like.svg";
import IconStyle from "../../../styles/icons.module.css";
import reactionStyle from "./Likes/react.module.css";
import PostStyle from "./post.module.css";
import {
  useAddNewCommentMutation,
  useFetchCommentsQuery,
} from "../../../app/features/comment/commentApi";
import {
  useFetchReactionsQuery,
  useLikePostMutation,
} from "../../../app/features/reaction/reactionApi";
import ImageViewer from 'react-simple-image-viewer';
import Portal from "../../../utils/Portal";

const Post = ({ post, isVisitor }) => {

  const { user } = useSelector((state) => state.user);
  const [currentImage, setCurrentImage] = React.useState(0);
  const [isViewerOpen, setIsViewerOpen] = React.useState(false);
  const [likePost] = useLikePostMutation();
  const [addNewComment] = useAddNewCommentMutation();
  const [commentOpen, setCommentOpen] = React.useState(false);
  const dispatch = useDispatch();
  const images = [post?.image];

  const canDelete = Boolean(
    user?._id === post?.owner?._id || user?._id === post?.owner
  );

  // filtering reactions by post
  const { Reactions } = useFetchReactionsQuery('fetchReactions', {
    selectFromResult: ({ data }) => ({
      Reactions: data?.ids.map(id => data?.entities[id]).filter((react) => react?.post === post?._id)
    }),
  })

  const {
    comments,
    isLoading: CommentsIsLoading,
    isFetching: CommentsIsFetching,
    isSuccess } = useFetchCommentsQuery('fetchComments', {
      selectFromResult: ({ data }) => ({
        comments: data?.ids.map(id => data?.entities[id]).filter(
          (comment) => comment?.post === post?._id)
      }),
    })


  //rootcomments that have no parent
  const rootComments = comments?.filter((comment) => comment.parentId === null);

  // onsubmitHandler
  async function addComment(text) {
    if (Boolean(text)) {
      let id = post?._id;
      await addNewComment({ id, text }).unwrap();
    }
  }

  //view image handlers
  const openImageViewer = React.useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  React.useEffect(() => {
    if (isViewerOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
    }
  }, [isViewerOpen]);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  return (
    <component.Card className={PostStyle.post}>
      <component.PostHead post={post} isVisitor={isVisitor} />
      <div className={PostStyle.post_body}>
        <p className={PostStyle.post_text}>{post?.text}</p>
        {post?.image && (
          <div className={`${PostStyle.image_container} `}>
            <img src={post?.image} className={PostStyle.post_image} alt="..." onClick={() => openImageViewer(0)}
            />
          </div>
        )}
      </div>
      <div className={PostStyle.footer}>
        <div className={PostStyle.reaction_infos}>
          <div className={PostStyle.reaction_infos_left}>
            <component.Likes userId={user?._id} Reactions={Reactions} />
          </div>
          <div
            className={PostStyle.reaction_infos_right}
            onClick={() => setCommentOpen(!commentOpen)}
          >
            <span>
              {comments?.length === 0
                ? "comment"
                : `${comments?.length} ${comments?.length > 1 ? "comments" : "comment"
                }`}
            </span>
          </div>
        </div>
        <div className={PostStyle.reaction}>
          <div
            className={`${reactionStyle.reaction} hover1`}
            onClick={() => {
              likePost(post?._id);
            }}
          >
            {Reactions?.find((reaction) => reaction.owner === user?._id) ? (
              <img src={chekedlike} alt="" style={{ width: "18px" }} />
            ) : (
              <i className={IconStyle.like_icon} />
            )}
            <span className={reactionStyle.react_span}>Like</span>
          </div>
          <div
            className={`${reactionStyle.reaction} hover1`}
            onClick={() => setCommentOpen(true)}
          >
            <i className={IconStyle.comment_icon} />
            <span className={reactionStyle.react_span}>comment</span>
          </div>

          {canDelete && (
            <div
              className={`${reactionStyle.reaction} hover1`}
              onClick={() => {
                dispatch(
                  openModal({
                    name: "DeleteConfirm",
                    childrenProps: { id: post?._id },
                  })
                );
              }}
            >
              <i className={IconStyle.trash_icon} />

              <span className={reactionStyle.react_span}>Delete</span>
            </div>
          )}
        </div>
      </div>
      {commentOpen && (
        <section>
          <CommentForm
            submitLabel="write"
            onSubmit={addComment}
            placholdertxt={`write a Comment ....`}
          />
          {rootComments != null && rootComments.length > 0 && (
            <div className={PostStyle.comments_section}>
              <component.Comments rootComments={rootComments} />
            </div>
          )}

        </section>
      )}
      {isViewerOpen && (
        <Portal>
          <ImageViewer
            src={images}
            currentIndex={currentImage}
            disableScroll={false}
            closeOnClickOutside={true}
            onClose={closeImageViewer}
          />
        </Portal>
      )}
    </component.Card>
  );
};
const memoizedPost = React.memo(Post)

export default memoizedPost;
