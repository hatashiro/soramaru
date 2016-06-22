export default function sleep(msec) {
  return new Promise(res => {
    setTimeout(res, msec);
  });
}
