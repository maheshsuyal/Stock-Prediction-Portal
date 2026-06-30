import os
from django.conf import settings
import matplotlib.pyplot as plt


def save_plot(plot_img_path):
    # Create media folder if it doesn't exist
    os.makedirs(settings.MEDIA_ROOT, exist_ok=True)

    image_path = os.path.join(settings.MEDIA_ROOT, plot_img_path)

    plt.savefig(image_path)
    plt.close()

    return settings.MEDIA_URL + plot_img_path