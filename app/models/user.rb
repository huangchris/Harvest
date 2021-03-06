# == Schema Information
#
# Table name: users
#
#  id              :integer          not null, primary key
#  username        :string           not null
#  email           :string           not null
#  password_digest :string           not null
#  session_token   :string           not null
#  affiliation     :string           not null
#  website_url     :string
#  profile_img_url :string
#  description     :text
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class User < ActiveRecord::Base
  after_initialize :ensure_session_token

  validates :email, :username, presence: true, uniqueness: true
  validates_format_of :email, :with => /@/
  validates :session_token, :password_digest, presence: true
  validates :password, confirmation: true, length: {minimum: 6, allow_nil: true}
  validates :username, length: {minimum: 6, maximum: 20}
  validates :password_confirmation, presence: true, allow_nil: true
  validates :affiliation, inclusion: { in: ["individual", "organization"]}

  before_save :default_image_url

  attr_reader :password, :password_confirmation

  has_many :harvsts, dependent: :destroy
  has_many :shares, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :notifications, dependent: :destroy
  has_many :shared_harvsts, through: :shares, source: :harvst

  def reset_session_token!
    self.session_token = User.generate_session_token
    save!
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def password_confirmation=(password_confirmation)
    @password_confirmation = password_confirmation
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  def self.find_by_credentials(username, password)
    user = User.find_by_username(username)
    return user if user && user.is_password?(password)
  end

  def harvst_settings(settings)
    if settings == 'all'
      return self.harvsts.order(end_date: :asc)
    end

    self.harvsts.order(end_date: :asc).where(privacy: settings)
  end

  private

  def User.generate_session_token
    SecureRandom::urlsafe_base64(16)
  end

  def ensure_session_token
    self.session_token ||= User.generate_session_token
  end

  def default_image_url
    if !self.profile_img_url || self.profile_img_url == ""
      self.profile_img_url = "http://res.cloudinary.com/harvst/image/upload/c_fill,h_500,w_500/v1445028940/treesilhouette_bnbyvx.png"
    end
  end

end
