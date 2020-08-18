import React, { useCallback, Fragment } from "react";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";
import {
  faFileExcel,
  faImage,
  faFile,
  faCode
} from "@fortawesome/free-solid-svg-icons";

const getFileExtension = filename => {
  return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
};

const getIcons = ext => {
  let fontIcon = "";
  if (ext === "txt") fontIcon = faFile;
  if (ext === "tsv") fontIcon = faFileExcel;
  if (ext === "html") fontIcon = faCode;
  if (ext === "jpg") fontIcon = faImage;
  return fontIcon;
};

const AChildComponent = ({ children, onClick, ...props }) => {
  const handleClick = useCallback(
    children => {
      return onClick(children);
    },
    [onClick]
  );

  return (
    <Fragment>
      <FA icon={getIcons(getFileExtension(props.name))} />{" "}
      <a href="# " className="child-row" {...props} onClick={() => handleClick(children)}>
        {props.name}
      </a>
    </Fragment>
  );
};

export default AChildComponent;
