export default function scrollIntoView(el) {
  el.scrollIntoView({
    behavior: "smooth",
    block: "end",
  });
}
