const MobilePlaylistItem = (artSrc, name, owner) => {
  return (
    <div className='playlist-item flex-row valign-wrapper'>
      <img src={artSrc} alt="playlist cover art" />
      <div className='flex-col'>
        <h6>{name}</h6>
        <p>{owner}</p>
      </div>
    </div>
  );
};

export default MobilePlaylistItem;