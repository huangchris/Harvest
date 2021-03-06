json.array! @harvsts do |harvst|
  json.extract! harvst, :title, :lat, :lng, :id, :image_url
  json.created_at time_ago_in_words(harvst.created_at)
  json.user do
    json.id harvst.user_id
    json.username harvst.user.username
  end
end
