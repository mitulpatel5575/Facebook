import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CustomInput, CustomButton } from "../../../index";
import Styles from "./comment.module.css";

const CommentForm = ({
  placholdertxt,
  submitLabel,
  onSubmit,
  InitialText = "",
  hasCancelButton = false,
  EditCancelHandler,
  autoFocus = false,
}) => {
  const CurrentUserImage = useSelector((state) => state.user.user.photo);
  const [text, setText] = useState(InitialText);
  const isTextareaDisabled = text.length === 0 || text === InitialText;

  //onSubmit handler
  async function handleSubmit(e) {
    e.preventDefault();
    await onSubmit(text);
    setText("");
  }
  return (
    <div className={Styles.comment_form_container}>
      {!(submitLabel === "update") && (
        <div className={Styles.comment_form_left}>
          <img className={Styles.comments_img} src={CurrentUserImage} alt="." />
        </div>
      )}
      <div className={Styles.comment_form_right}>
        <div className={Styles.comment_form_inputs}>
          <form onSubmit={handleSubmit}>
            <CustomInput
              autoFocus={autoFocus}
              type="textarea"
              className="commentInput"
              placeholder={placholdertxt}
              name="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
            />

            <CustomButton
              type="submit"
              value={submitLabel === "update" ? "update" : "Send"}
              className="commentbtn"
              disabled={isTextareaDisabled}
            />
            {hasCancelButton && (
              <CustomButton
                type="submit"
                value="cancel"
                className="commentcancelbtn"
                onClick={EditCancelHandler}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentForm;
