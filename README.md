# frontend-xfer
Front-end Data Transfer and Exchange

## Description

The purpose of this project is to demostrate how to communicate between two or more fglrun processes. The \
project uses a customized frontcall to trigger an action to all the programs in the user session.  When the \
action is triggered by GBC, the programs receiving the action need to call another customized frontcall to \
receive the data from the frontend.

The following 4 modes have been tested:
 - GBC in Single Page Application mode *Works in all use cases*
 - GBC in Multi-Browser Page mode *Works in all use cases*
 - GDC-UR in Single Page Application mode *Works with 2 programs, but not when more programs are added*
 - GDC-UR in Multi-Window mode *Does not work*

## Usage

In order to run the project, you need to build the GBC using the customization included in this project.  The \
Genero BDL program supports two command line arguments, --child and --browserTab.  The 'child' argument is \
used when calling the child programs and disables the 'launch_pgm' action.  The 'browserTab' argument is used \
to load a stylesheet that sets 'browserMultiPage' to 'yes' and 'desktopMultiWindow' to 'yes' to alter the \
behavior of the child processes.

