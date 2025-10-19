import { CardMovie } from "./Movies/components/CardMovie";
function Movies() {
  return (
    <div>
      <h1 className="text-4xl text-center font-bold text-white my-20">
        Películas en Estreno
      </h1>
      <CardMovie/>
    </div>
  );
}

export default Movies;
