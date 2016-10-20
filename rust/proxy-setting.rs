use std::env;
use std::process::Command;
use std::os::unix::process::CommandExt;

fn main() {
    let args: Vec<_> = env::args().collect();
    if args.len() > 1 {
        println!("The first argument is {}, {}", args[1], args[2]);
    }

    unsafe {
        syscall!(SETUID, 0)
    }

    let output = CommandExt::new("sh")
        .arg("-c")
        .arg("touch aaa")
        .output()
        .expect("failed to execute process");
    let hello = output.stdout;
    print!("aaa {}", String::from_utf8_lossy(hello.as_slice()));
}