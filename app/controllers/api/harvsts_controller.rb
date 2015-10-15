class Api::HarvstsController < ApplicationController
  def create
    @harvst = Harvst.new(harvst_params)
    @harvst.user_id = current_user.id
    if @harvst.save
      render :show
    else
      render json: @harvst.errors.full_messages, status: 422
    end
  end

  def destroy
    @harvst = Harvst.find(params_id)

    if @harvst
      @harvst.destroy
    end

    render :index
  end

  def index
    @harvsts = Harvst.in_bounds(params[:bounds])
                     .includes(:user)
  end

  def show
    @harvst = Harvst.find(params[:id])
  end

  def update
    @harvst = Harvst.find(params[:id])

    if @harvst.update(harvst_params)
      render :show
    else
      render json: @harvst.errors.full_messages, status: 422
    end
  end

  private

  def harvst_params
    params.require(:harvst).permit(:title, :description, :lat, :lng, :privacy,
      :start_date, :end_date, :image_url, :contact, :address)
  end
end
