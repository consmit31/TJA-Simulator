import pygame
import sys

# Initialize Pygame
pygame.init()

# Screen dimensions
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
HIGHLIGHT_COLOR = (50, 200, 50)

# Fonts
FONT = pygame.font.Font(None, 40)

# Screen setup
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Driving Scenarios Simulator")

# Menu options for 10 use cases
menu_options = [f"Use Case {i}" for i in range(1, 11)]
selected_option = 0  # Tracks which menu option is currently selected

def draw_text(text, font, color, surface, x, y):
    """Helper function to draw text on the screen."""
    textobj = font.render(text, True, color)
    textrect = textobj.get_rect(center=(x, y))
    surface.blit(textobj, textrect)

def main_menu():
    """Main menu loop."""
    global selected_option
    while True:
        screen.fill(BLACK)
        
        # Draw the menu options
        for i, option in enumerate(menu_options):
            color = HIGHLIGHT_COLOR if i == selected_option else WHITE
            draw_text(option, FONT, color, screen, SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + i * 50 - 200)
        
        pygame.display.flip()
        
        # Event handling for menu navigation
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_UP:
                    selected_option = (selected_option - 1) % len(menu_options)
                elif event.key == pygame.K_DOWN:
                    selected_option = (selected_option + 1) % len(menu_options)
                elif event.key == pygame.K_RETURN:
                    # Start the selected use case
                    start_use_case(selected_option + 1)

def start_use_case(case_number):
    """Function to start the chosen use case (road simulation)."""
    while True:
        # Just for illustration, set a different background color for each use case
        color = (case_number * 25 % 255, case_number * 50 % 255, case_number * 75 % 255)
        screen.fill(color)
        
        # Display the current use case on screen
        draw_text(f"Use Case {case_number} - Road Simulation", FONT, WHITE, screen, SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2)
        draw_text("Press ESC to return to Menu", FONT, WHITE, screen, SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + 50)
        
        pygame.display.flip()
        
        # Handle events in the use case loop
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    return  # Go back to main menu

# Start the main menu
main_menu()
