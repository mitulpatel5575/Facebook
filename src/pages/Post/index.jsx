import React, { useEffect } from "react";
import classes from "./style.module.css";
import {Post , PostSkeleton} from "../../components/index";
import { useNavigate ,useParams} from "react-router-dom";
import { useFetchPostQuery } from "../../app/features/post/postApi";

function PostPage() {
  const navigate = useNavigate();

  const { id } = useParams();
 const {data,isLoading ,isError ,isFetching,isSuccess} = useFetchPostQuery(id)
 const post = data?.entities[id]


  const postsSkelton = isLoading || isFetching;

  useEffect(() => {
    if (isError) {
      navigate("/404");
    }
  }, [isError]);

  return (
    <div className={classes.post}>
      <div className={classes.container}>
        {postsSkelton && <PostSkeleton />}
        {isSuccess && !isLoading && <Post post={post}/>}
      </div>
    </div>
  );
}

export default PostPage;
