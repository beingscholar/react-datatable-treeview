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
const linkCheck = url => {
  var http = new XMLHttpRequest();
  http.open("HEAD", url, false);
  http.send();
  return http.status !== 404;
};

const AChildComponent = ({ children, onClick, ...props }) => {
  const handleClick = useCallback(({ name, path }) => {
    path = path.slice(0, path.lastIndexOf("/"));
    fetch(`${process.env.PUBLIC_URL + path}`).then(response => {
      if (linkCheck(response.url + "/" + name)) {
        if (getFileExtension(name) !== "html") {
          response.blob().then(blob => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            a.download = name;
            a.click();
          });
        } else {
          window.open(`${response.url + "/" + name}`, "_blank");
        }
      }
    });
  }, []);

  return (
    <Fragment>
      <FA icon={getIcons(getFileExtension(props.name))} />{" "}
      <a
        href="# "
        // target="_blank"
        className="child-row"
        {...props}
        onClick={() => handleClick(children)}
      >
        {props.name}
      </a>
    </Fragment>
  );
};

export default AChildComponent;
