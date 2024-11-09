/* eslint-disable react/prop-types */
import css from "./Wall.module.css";

export default function Wall({ styleData }) {
  return <div className={css.wall} style={styleData}></div>;
}
