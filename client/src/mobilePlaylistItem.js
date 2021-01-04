const MobilePlaylistItem = (playlist) => {
  return (
    <div className='playlist-item flex-row valign-wrapper'>
      <img src={playlist.images[0].url} alt="playlist cover art" />
      <div className='flex-col'>
        <h6 className='playlist-text'>{playlist.name}</h6>
        <p className='playlist-text'>{playlist.owner.display_name}</p>
      </div>
    </div>
  );
};

export default MobilePlaylistItem;