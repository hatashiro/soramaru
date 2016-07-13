export default function asyncRoute(asyncFunc) {
  return (req, res, next) => asyncFunc(req, res, next).catch(next);
}
