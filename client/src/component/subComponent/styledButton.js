import styled from "styled-components";

export const SButton = styled.button.attrs((props) => ({
  color: props.color || "white",
  bgColor: props.bgColor || "rgba(0,0,0,0.9)",
  hoverBg: props.hoverBg || "rgba(0,0,0,0.85)",
}))`
  border: none;
  width: auto;
  outline: none;
  text-align: center;
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.color};
  font-size: 1rem;
  padding: 10px 60px;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
  &:hover {
    background-color: ${(props) => props.hoverBg};
  }
`;
export const LogOutButton = styled(SButton)`
  color: #fff;
  background-color: #c44536;

  &:hover {
    background-color: rgba(255, 0, 0, 0.9);
  }
`;
