const TrackGrid = (tracks) => {
  tracks.sort((a, b) => (a.track.name).localeCompare(b.track.name));
  return (
    <table className='striped highlight'>
      <thead>
        <tr>
          <th>Title</th>
          <th>Artist</th>
          <th>Popularity</th>
        </tr>
      </thead>
      <tbody>
        {tracks.map((trackObj, i) => Track(trackObj.track, i))}
      </tbody>
    </table>
  );
};

const Track = (track, key) => {
  return (
    <tr key={key}>
      <td>{track.name}</td>
      <td>{artistsToString(track)}</td>
      <td>{track.popularity}</td>
    </tr>
  );
};

function artistsToString(track) {
  const artists = track.artists.map(artist => artist.name);
  return artists.join(", ");
}

export { Track, TrackGrid };